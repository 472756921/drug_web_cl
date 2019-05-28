import React from "react";
import {Form, Input, Modal, Popconfirm, Table, Divider, DatePicker, Select, message} from 'antd';
import moment from 'moment';
import Top from './top';
import {interfaces, request} from "../../interface";

const Option = Select.Option;
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
let _this = '';
class Drug extends React.Component{
    state = {
        visible: false,
        cdata: '',
        tsMessage: '请输入相应内容',
        dataSource: [],
        DisseaseListData: [],
    }

    async delconfirm(id) {
        const { data } =  await request(interfaces.del, {method: 'Delete', body:{id: id} });
        if(data.code === 200) {
            message.success('删除成功');
            this.getListData();
        } else {
            message.error(data.error);
        }
    }
    showModal = (record) => {
        let temp = '';
        if(record !== undefined) {
            temp = JSON.parse(JSON.stringify(record));
            temp.diseaseID = temp.diseaseID.split(' , ');
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
                values.USDate = moment(values.USDate).format('YYYY-MM-DD');
                values.CHData = values.CHData != null ? moment(values.CHData).format('YYYY-MM-DD') : null;
                values.USPrice = values.USPrice !== '' ? values.USPrice : 0;
                values.CHPrice = values.CHPrice !== '' ? values.CHPrice : 0;
                if(cdata.id) { //修改
                    values.id = cdata.id;
                    this.handleUpdate(values);
                } else { //添加
                    this.handleAdd(values);
                }
            }
        });
    }

    async handleAdd(values) {
        const { data } =  await request(interfaces.addDrug, {method: 'post', body:values });
        if(data.code === 200) {
            message.success('添加成功')
            this.handleCancel();
            this.getListData();
        } else {
            message.error(data.error);
        }
    }

    async handleUpdate(values) {
        const { data } =  await request(interfaces.updateDrug, {method: 'PUT', body:values });
        if(data.code === 200) {
            message.success('修改成功')
            this.handleCancel();
            this.getListData();
        } else {
            message.error(data.error);
        }
    }

    componentDidMount() {
        this.getListData();
        this.getDisseaseListData();
        _this = this;
    }

    async getListData(sdata='') {
        const {data} = await request(interfaces.listAdmin, {method: 'GET', params:sdata });
        _this.setState({
            dataSource: data,
        })
    }
    async getDisseaseListData(sdata='') {
        const {data} = await request(interfaces.diseaseList, {method: 'GET'});
        this.setState({
            DisseaseListData: data.data || [],
        })
    }

    render(){
        const { cdata, tsMessage, dataSource, DisseaseListData } = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: 'Hot值',
                dataIndex: 'checkCount',
                key: 'checkCount'
            },
            {
                title: '通用名',
                dataIndex: 'name1',
                render: (r, t) => {
                    return <span>{t.name1} / {t.name3}</span>
                }
            },
            {
                title: '商品名',
                dataIndex: 'name2',
                render: (r, t) => {
                    return <span>{t.name2} / {t.name4}</span>
                }
            },
            {
                title: '生产厂家',
                dataIndex: 'factory',
                key: 'factory',
            },
            {
                title: '上市日期',
                dataIndex: 'date',
                width: 240,
                render: (r, t) => {
                    return  <span>
                                <img src={require('../../images/usa.svg')} width={20}  alt='美国上市时间'/> {moment(t.USDate).format('YYYY-MM-DD')}
                                <Divider type="vertical"/>
                                <img src={require('../../images/china.svg')} width={20} alt='国内上市时间'/> {t.CHData ? moment(t.CHData).format('YYYY-MM-DD') : '未上市'}
                            </span>
                }
            },
            // {
            //     title: '价格',
            //     dataIndex: 'price',
            //     render: (r, t) => {
            //         return  <span>
            //                     ${t.USPrice}
            //                     <Divider type="vertical"/>
            //                     ￥{t.CHData ? t.CHPrice : '未上市'}
            //                 </span>
            //     }
            // },
            {
                title: '添加日期',
                dataIndex: 'AddDate',
                width: 120,
                key: 'AddDate',
                render: (t) => {
                    return moment(t).format('YYYY-MM-DD');
                }
            },
            {
                title: '分类',
                dataIndex: 'diseaseName',
                key: 'diseaseName',
            },
            {
                title: '操作',
                key: 'action',
                width: 120,
                render: (text, record) => (
                    <span>
                        <span onClick={() => this.showModal(record)} className='isclick'>修改</span>
                        <Divider type="vertical"/>
                        <Popconfirm title="Are you sure delete this item?" onConfirm={() => this.delconfirm(record.id)} okText="Yes" cancelText="No">
                            <span className='isclick'>删除</span>
                        </Popconfirm>
                    </span>
                ),
            }
        ];
        const pagination = {
            defaultPageSize: 20,
        };

        return (
            <div>
                <Top showModal={this.showModal} getListData={this.getListData}/>
                <Table columns={columns} dataSource={dataSource} rowKey={ _ => _.id } pagination={pagination} />
                <Modal
                    width={600}
                    title={cdata.id ? '修改药品信息' : '添加药品'}
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                    keyboard={false}
                    maskClosable={false}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="通用名（EN）">
                            {getFieldDecorator('name1', {
                                initialValue: cdata.name1 || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="通用名（ZH）">
                            {getFieldDecorator('name3', {
                                initialValue: cdata.name3 || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="商品名（EN）">
                            {getFieldDecorator('name2', {
                                initialValue: cdata.name2 || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="商品名（ZH）">
                            {getFieldDecorator('name4', {
                                initialValue: cdata.name4 || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="生产厂家">
                            {getFieldDecorator('factory', {
                                initialValue: cdata.factory || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="美国上市时间">
                            {getFieldDecorator('USDate', {
                                initialValue: cdata.USDate != null ? moment(cdata.USDate) : null,
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <DatePicker style={{width: '100%'}}/>
                            )}
                        </Form.Item>
                        <Form.Item label="国内上市时间">
                            {getFieldDecorator('CHData', {
                                initialValue: cdata.CHData != null ? moment(cdata.CHData) : null,
                                rules: [{ required: false, message: tsMessage }],
                            })(
                                <DatePicker style={{width: '100%'}}/>
                            )}
                        </Form.Item>
                        <Form.Item label="美国价格（$）">
                            {getFieldDecorator('USPrice', {
                                initialValue: cdata.USPrice || '',
                                rules: [{ required: false, message: tsMessage }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="国内价格（￥）">
                            {getFieldDecorator('CHPrice', {
                                initialValue: cdata.CHPrice || '',
                                rules: [{ required: false, message: tsMessage }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="适应症">
                            {getFieldDecorator('Indication', {
                                initialValue: cdata.Indication || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <TextArea rows={4} />
                            )}
                        </Form.Item>
                        <Form.Item label="用法用量">
                            {getFieldDecorator('Dosage', {
                                initialValue: cdata.Dosage || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <TextArea rows={2} />
                            )}
                        </Form.Item>
                        <Form.Item label="注意事项">
                            {getFieldDecorator('Precautions', {
                                initialValue: cdata.Precautions || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <TextArea rows={2} />
                            )}
                        </Form.Item>
                        <Form.Item label="不良反应">
                            {getFieldDecorator('AdverseReactions', {
                                initialValue: cdata.AdverseReactions || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <TextArea rows={2} />
                            )}
                        </Form.Item>
                        <Form.Item label="剂型规格">
                            {getFieldDecorator('FormulationSpecification', {
                                initialValue: cdata.FormulationSpecification || '',
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <TextArea rows={2} />
                            )}
                        </Form.Item>
                        <Form.Item label="类型">
                            {getFieldDecorator('classType', {
                                initialValue: cdata.diseaseID || [],
                                rules: [{ required: true, message: tsMessage }],
                            })(
                                <Select mode="multiple">
                                    {
                                        DisseaseListData.map((it) => {
                                            return <Option key={it.id} value={it.id+''}>{it.name}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="文章链接">
                            {getFieldDecorator('articleLink', {
                                initialValue: cdata.articleLink || '',
                                rules: [{ required: false, message: tsMessage }],
                            })(<Input />)}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create({ name: 'horizontal_login' })(Drug);