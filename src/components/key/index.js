import React from "react";
import {Form, Input, Modal, Popconfirm, Table, Divider, Radio, Button} from 'antd';
import {randomString, status} from '../../common';
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

class Key extends React.Component{
    state = {
        visible: false,
        cdata: '',
        tsMessage: '请输入相应内容'
    }

    delconfirm = () => {
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
                console.log('Received values of form: ', values);
            }
        });
    }
    handleNewKey = () => {
        const { cdata } = this.state;
        let temp = cdata;
        temp.key = randomString(34);
        this.setState({
            cdata: temp
        })
    }
    render(){
        const { cdata, tsMessage } = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '生成日期',
                dataIndex: 'createDate',
                key: 'createDate',
            },
            {
                title: 'key',
                dataIndex: 'key',
                key: 'key',
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
                        <Popconfirm title="Are you sure delete this items?" onConfirm={this.delconfirm} okText="Yes" cancelText="No">
                            <span className='isclick'>删除</span>
                        </Popconfirm>
                    </span>
                ),
            }
        ];
        const dataSource = [
            {
                id: 1,
                name: 'xxx',
                createDate: '2012-12-24',
                status: 1,
                key: 'xxxxxxxxxxxxxxxx',
            },
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
                        <Form.Item label="名称">
                            {getFieldDecorator('name', {
                                initialValue: cdata.name || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="key">
                            {getFieldDecorator('key', {
                                initialValue: cdata.key || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <Input disabled/>
                            )}
                        </Form.Item>
                        <Form.Item label="状态">
                            {getFieldDecorator('status', {
                                initialValue: cdata.status || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <RadioGroup>
                                    <Radio value={1}>正常</Radio>
                                    <Radio value={0}>禁用</Radio>
                                </RadioGroup>
                            )}
                        </Form.Item>
                        <Form.Item label="操作">
                            <Button type='danger' onClick={this.handleNewKey}>生成KEY</Button>
                            <span style={{color: '#ccc'}}>（此操作将会导致原Key失效）</span>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create({ name: 'horizontal_login' })(Key);