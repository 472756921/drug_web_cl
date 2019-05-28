import React from "react";
import {Form, Input, Modal, Popconfirm, Table, Divider, Radio, Button, message} from 'antd';
import moment from 'moment'
import { role, status } from '../../common';
import { request, interfaces } from '../../interface';
const RadioGroup = Radio.Group;



const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

class Admin extends React.Component{
    state = {
        visible: false,
        cdata: '',
        dataSource: [],
        tsMessage: '请输入相应内容'
    }

    componentDidMount() {
        this.getList();
    }

    async getList() {
        const {data} = await request(interfaces.adminList, {method: 'GET'});
        this.setState({
            dataSource: data.data || [],
        })
    }
    async update(value) {
        const {data} = await request(interfaces.adminupdate, {method: 'PUT', body:value});
        if(data.code === 200) {
            this.getList();
            this.handleCancel();
            message.success('修改成功');
        } else {
            message.error('修改失败');
        }
    }
    async add(value) {
        const {data} = await request(interfaces.adminadd, {method: 'POST', body:value});
        if(data.code === 200) {
            this.getList();
            this.handleCancel();
            message.success('修改成功');
        } else if(data.code === 403) {
            message.warning('账号重复，请更换');
        } else {
            message.error('添加失败');
        }
}

    async delconfirm (id){
        const {data} = await request(interfaces.admindel, {method: 'Delete', body:{id:id}});
        if(data.code === 200) {
            this.getList();
            this.handleCancel();
            message.success('删除成功');
        } else {
            message.error('删除失败');
        }
    }

    showModal = (record) => {
        let temp = '';
        if(record) {
            temp = record;
        }
        this.setState({
            visible: true,
            cdata: temp,
        });
    }
    handleCancel = (e) => {
        const { resetFields } = this.props.form;
        this.setState({
            visible: false,
        });
        resetFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { cdata } = this.state;
                if(cdata.id) { //update
                    if(values.pws === '') {
                        delete values['pws'];
                    }
                    values.id = cdata.id;
                    values.account = cdata.account;
                    this.update(values);
                } else {
                    this.add(values);
                }
            }
        });
    }


    render(){
        const { cdata, tsMessage, dataSource } = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '用户名',
                dataIndex: 'account',
                key: 'account',
            },
            {
                title: '生成日期',
                dataIndex: 'createDate',
                key: 'createDate',
                render: (t) => {
                    return t?moment(t).format('YYYY-MM-DD'):'';
                }
            },
            {
                title: '最后登录日期',
                dataIndex: 'loginDate',
                key: 'loginDate',
                render: (t) => {
                    return t?moment(t).format('YYYY-MM-DD'):'';
                }
            },
            {
                title: '角色',
                dataIndex: 'role',
                key: 'role',
                render: (t) => {
                    return role[t]
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (t) => {
                    return status[t]
                }
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <span onClick={() => this.showModal(record)} className='isclick'>修改</span>
                        <Divider type="vertical"/>
                        <Popconfirm title="Are you sure delete this items?" onConfirm={() => this.delconfirm(text.id)} okText="Yes" cancelText="No">
                            {
                                text.account === 'root' ?'' : <span className='isclick'>删除</span>
                            }
                        </Popconfirm>
                    </span>
                ),
            }
        ];
        return (
            <div>
                <Button type="primary" icon='plus' className='addBTN' onClick={this.showModal}> 新增 </Button>
                <Divider/>
                <Table columns={columns} dataSource={dataSource} rowKey={ _ => _.id }/>

                <Modal
                    title={cdata.id ? '修改用户信息' : '添加用户'}
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Form {...formItemLayout}>
                        {
                            cdata.id ? '' :
                                <Form.Item label="用户名">
                                    {getFieldDecorator('account', {
                                        initialValue: cdata.account || '',
                                        rules: [{ required: true, message: tsMessage }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                        }
                        <Form.Item label="密码">
                            {getFieldDecorator('pws', {
                                initialValue: cdata.pws || '',
                                rules: [{ required: cdata.id?false:true, message: tsMessage }],
                            })(
                                <Input placeholder={cdata.id?'为空表示不修改密码':''}/>
                            )}
                        </Form.Item>
                        <Form.Item label="角色">
                            {getFieldDecorator('role', {
                                initialValue: Number(cdata.role),
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <RadioGroup>
                                    <Radio value={1}>admin</Radio>
                                    <Radio value={0}>root<span style={{color: '#ccc'}}>(最高权限)</span></Radio>
                                </RadioGroup>
                            )}
                        </Form.Item>
                        <Form.Item label="状态">
                            {getFieldDecorator('status', {
                                initialValue: cdata.status,
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <RadioGroup>
                                    <Radio value={1}>正常</Radio>
                                    <Radio value={0}>禁用</Radio>
                                </RadioGroup>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create({ name: 'horizontal_login' })(Admin);