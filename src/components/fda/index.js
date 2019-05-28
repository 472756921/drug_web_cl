import React from "react";
import {Button, Divider, Form, Input, Modal, Table, message} from 'antd';
import moment from 'moment';
import {interfaces, request} from "../../interface";
const { TextArea } = Input;
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
        btnd: false,
        visible: false,
        cdata: '',
        tsMessage: '请输入相应内容',
        dataSource: []
    }

    componentDidMount() {
        this.getListData();
    }

    async getListData(sdata='') {
        const {data} = await request(interfaces.fdaList, {method: 'GET', params:sdata });
        if(data.code === 200) {
           this.setState({
               dataSource: data.results,
           })
        }
    }

    async updateFDA(value) {
        const {data} = await request(interfaces.fdaList, {method: 'PUT', body: value });
        if(data.code === 200) {
            message.success('修改成功');
            this.getListData();
            this.handleCancel();
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
                values.id = cdata.id;
                this.updateFDA(values)
            }
        });
    }

    handleSpider = () => {
        message.success('蜘蛛已经发出，稍后为您带来爬取结果');
        this.setState({
            btnd: true
        });
        setTimeout( () => { this.setState({btnd: false})}, 50000 );
        this.spider();
    }

    async spider() {
        const {data} = await request(interfaces.spider, {method: 'GET' });
        message.info(data.data)
    }

    render(){
        const { cdata, tsMessage, btnd, dataSource } = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '爬取日期',
                dataIndex: 'addDate',
                key: 'addDate',
                render: (t) => {
                    return moment(t).format('YYYY-MM-DD HH:mm')
                }
            },
            {
                title: 'FDA发布日期',
                dataIndex: 'USdate',
                key: 'USdate',
            },
            {
                title: '详情链接',
                dataIndex: 'links',
                key: 'links',
                render: (t) => {
                    return <a href={'https://www.fda.gov' + t}> FDA详情 </a>
                }
            },
            {
                title: '详情',
                dataIndex: 'desDatile',
                key: 'desDatile',
                width: 500
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <span onClick={() => this.showModal(record)} className='isclick'>修改</span>
                    </span>
                ),
            }
        ];
        return (
            <div>
                <Button type="primary" icon='cloud' className='addBTN' onClick={this.handleSpider} disabled={btnd}> 手动爬取 </Button>
                <div style={{color: '#aaa', padding: '10px'}}>目前FDA自动爬取频率为每 <span style={{color: '#666'}}>8小时</span> 爬取一次，单次失败不再试</div>
                <Divider/>

                <Table columns={columns} dataSource={dataSource} rowKey={ _ => _.id }/>

                <Modal
                    width={600}
                    title={cdata.id ? '修改用户信息' : '添加用户'}
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="发布日期">
                            {getFieldDecorator('USdate', {
                                initialValue: cdata.USdate || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <Input disabled/>
                            )}
                        </Form.Item>
                        <Form.Item label="详情">
                            {getFieldDecorator('desDatile', {
                                initialValue: cdata.desDatile || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <TextArea rows={6}/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create({ name: 'horizontal_login' })(Key);