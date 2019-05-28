import React from "react";
import {Form, Input, Modal, Popconfirm, Table, Divider, Button, message} from 'antd';
import {randomString} from '../../common';
import {interfaces, request} from "../../interface";
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

class Disease extends React.Component{
    state = {
        visible: false,
        cdata: '',
        tsMessage: '请输入相应内容',
        dataSource: []
    }


    componentDidMount() {
        this.getList();
    }

    async getList() {
        const {data} = await request(interfaces.diseaseList, {method: 'GET'});
        this.setState({
            dataSource: data.data || [],
        })
    }
    async update(value) {
        const {data} = await request(interfaces.diseaseUpdate, {method: 'PUT', body:value});
        if(data.code === 200) {
           this.getList();
           this.handleCancel();
            message.success('修改成功');
        } else {
            message.error('修改失败');
        }
    }
    async add(value) {
        const {data} = await request(interfaces.diseaseAdd, {method: 'POST', body:value});
        if(data.code === 200) {
            this.getList();
            this.handleCancel();
            message.success('添加成功');
        } else {
            message.error('添加失败');
        }
    }

    async delconfirm (id){
        const {data} = await request(interfaces.diseaseDel, {method: 'Delete', body:{id:id}});
        if(data.code === 200) {
            this.getList();
            this.handleCancel();
            message.success('删除成功');
        }else{
            message.error('不能删除该项，还有药物引用');
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
                if(cdata.id) {
                    values.id = cdata.id;
                    this.update(values);
                } else {
                    this.add(values);
                }
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
        const { cdata, tsMessage, dataSource } = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <span onClick={() => this.showModal(record)} className='isclick'>修改</span>
                        <Divider type="vertical"/>
                        <Popconfirm title="Are you sure delete this items?" onConfirm={() => this.delconfirm(text.id)} okText="Yes" cancelText="No">
                            <span className='isclick'>删除</span>
                        </Popconfirm>
                    </span>
                ),
            }
        ];
        return (
            <div>
                <Button type="primary" icon='plus' className='addBTN' onClick={this.showModal}> 新增 </Button>
                <Divider/>
                <Table columns={columns} dataSource={dataSource} rowKey={ _ => _.id } pagination={{defaultPageSize:20}}/>

                <Modal
                    title={cdata.id ? '修改疾病' : '添加疾病'}
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
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create({ name: 'horizontal_login' })(Disease);