import React from "react";
import Styles from './styles.module.css';
import {Divider, Input, Table, Modal, Col, Row, Button} from "antd";
import {interfaces, request} from "../../interface";
import moment from "moment";
import { filterRule} from "../../common";
const Search = Input.Search;

export default class Client extends React.Component{

    state = {
        drugList: [],
        dataSource: [],
        cd: '',
        vis: false,
        content: {
            left: '50%',
            top: '30%',
            transform: 'translate(-50%, -50%)',
        },
        div: {
            float: '',
            margin: '30px 0 4px',
        },
        inputSize: 'large',
        imgwidth: 400,
        reslut:{
            opacity: '0',
        },
    }

    componentDidMount() {
        this.getHotDrugList();
    }

    async getHotDrugList() {
        const {data} = await request(interfaces.getHotDrug, {});
        this.setState({
            drugList: data.results || [],
        });
    }
    async drugClick(value) {
        await request(interfaces.drugContent, {body: value, method: 'PUT',});
    }
    async getListData(value='') {
        value  = filterRule(value);
        const {data} = await request(interfaces.list, {method: 'GET', params:{name: value} });
        this.setState({
            dataSource: data.data || [],
        })
    }
    handelChange = (data) => {
        const value = data.target.value;
        if(value === '') {
            this.closeS();
        }
    }
    handelSearch = (value) => {
        if(value === '') {
            this.closeS();
        } else {
            this.openS(value);
        }
    }
    showModal = (data) => {
        this.setState({
            vis: true,
            cd: data
        })
        this.drugClick(data);
    }
    handelColse = () => {
        this.setState({
            vis: false
        })
    }
    openS = (value) => {
        this.getListData(value);
        this.setState({
            dataSource:[],
            content: {
                left: '2%',
                top: '0%',
                transform: 'translate(0%, 0%)',
                width: '98%',
                transition: 'top .5s, left .5s, transform .5s, float .5s, width 1s',
                WebkitTransition: 'top .5s, left .5s, transform .5s, float .5s, width 1s',
            },
            div: {
                float: 'left',
                margin: '10px',
            },
            datile: {
                display: 'none',
                opacity: '0',
                transition: 'opacity .2s',
                WebkitTransition: 'opacity .2s'
            },
            imgwidth: 200,
            inputSize: 'default',
            reslut:{
                opacity: '1',
                transition: 'opacity 1s',
                WebkitTransition: 'opacity 1s'
            }
        })
    }
    closeS = () => {
        this.setState({
            content: {
                left: '50%',
                top: '30%',
                transform: 'translate(-50%, -50%)',
                transition: 'top .5s, left .5s, transform .5s, float .5s',
                WebkitTransition: 'top .5s, left .5s, transform .5s, float .5s'
            },
            div: {
                float: '',
                margin: '30px 0 4px',
            },
            inputSize: 'large',
            imgwidth: 400,
            datile: {
                opacity: '1',
                transition: 'opacity 1s',
                WebkitTransition: 'opacity 1s'
            },
            reslut:{
                opacity: '0',
                transition: 'opacity .2s',
                WebkitTransition: 'opacity .2s',
                display: 'none'
            }
        })
    }

    render() {
        const { vis, content, div, imgwidth, inputSize, reslut, cd, datile, dataSource, drugList } = this.state;
        const columns = [
            {
                title: '通用名',
                dataIndex: 'name1',
                render: (r, t) => {
                    return <span>{t.name1}/{t.name3}</span>
                }
            },
            {
                title: '商品名',
                dataIndex: 'name2',
                render: (r, t) => {
                    return <span>{t.name2}/{t.name4}</span>
                }
            },
            {
                title: '生产厂家',
                dataIndex: 'factory',
                key: 'factory',
            },
            {
                title: '上市日期',
                width: 260,
                dataIndex: 'date',
                render: (r, t) => {
                    return  <span>
                                {
                                    moment(t.USDate).format('YYYY-MM-DD')} <img src={require('../../images/usa.svg')} width={20}  alt='美国上市时间'/>
                                    <Divider type="vertical"/>
                                    <img src={require('../../images/china.svg')} width={20} alt='国内上市时间'/> {t.CHData ? moment(t.CHData).format('YYYY-MM-DD') : '未上市'
                                }
                            </span>
                }
            },
            {
                title: '分类',
                width: 250,
                dataIndex: 'diseaseName',
                key: 'diseaseName',
            },
            {
                title: '详情',
                key: 'action',
                width: 80,
                render: (text, record) => (
                    <span>
                        <span onClick={() => this.showModal(record)} className='isclick'>详情</span>
                    </span>
                ),
            }
        ];
        return (
            <div className={Styles.Client}>
                <div className={Styles.content} style={content}>
                   <div style={div}>
                       <a href='https://www.medebound.com/' target='_blank' rel="nofollow me noopener noreferrer">
                           <img src={require('../../images/logo_b.png')} width={imgwidth} alt='美联医邦'/>
                       </a>
                   </div>
                   <div style={div}>
                       <Search allowClear placeholder="输入药品名或疾病名" enterButton="Search" size={inputSize} onSearch={this.handelSearch} onChange={this.handelChange}/>
                   </div>
                    <div className={Styles.ercode} style={datile}>
                        <Row>
                            {
                                drugList.map((it, i) => {
                                    return <Col key={i} className={Styles.anlitext} span={4}><span onClick={() => this.showModal(it)}>{it.name4}</span></Col>
                                })
                            }
                        </Row>
                    </div>
                </div>
                <div className={Styles.reslut} style={reslut}>
                    <Table rowKey={_ => _.id} columns={columns} dataSource={dataSource} bordered pagination={{defaultPageSize: 20}}/>
                </div>

                <Modal
                    keyboard={false}
                    maskClosable={false}
                    title={cd.name1 + '详情'}
                    visible={vis}
                    width={800}
                    footer={[
                        <Button key="back" onClick={this.handelColse}>关闭</Button>,
                    ]}
                    onCancel={this.handelColse}
                >
                    <Row>
                        <Col className={Styles.itemList} span={5}>通用名：</Col>
                        <Col className={Styles.itemList} span={18}>{cd.name1} / {cd.name3}</Col>
                        <Col className={Styles.itemList} span={5}>商品名：</Col>
                        <Col className={Styles.itemList} span={18}>{cd.name2} / {cd.name4}</Col>
                        <Col className={Styles.itemList} span={5}>生产厂家：</Col>
                        <Col className={Styles.itemList} span={18}>{cd.factory}</Col>
                        <Col className={Styles.itemList} span={5}>美国上市时间：</Col>
                        <Col className={Styles.itemList} span={18}>{moment(cd.USDate).format('YYYY-MM-DD')}</Col>
                        <Col className={Styles.itemList} span={5}>国内上市时间：</Col>
                        <Col className={Styles.itemList} span={18}>{cd.CHData? moment(cd.CHData).format('YYYY-MM-DD') : '国内暂未上市' }</Col>
                        {/*<Col className={Styles.itemList} span={5}>美国价格($)：</Col>*/}
                        {/*<Col className={Styles.itemList} span={18}>{cd.USPrice}</Col>*/}
                        {/*<Col className={Styles.itemList} span={5}>国内价格(￥)：</Col>*/}
                        {/*<Col className={Styles.itemList} span={18}>{cd.CHPrice || '国内暂未上市' }</Col>*/}
                        <Col className={Styles.itemList} span={5}>适应症：</Col>
                        <Col className={Styles.itemList} span={18}>{cd.Indication}</Col>
                        {/*<Col className={Styles.itemList} span={5}>用法用量：</Col>*/}
                        {/*<Col className={Styles.itemList} span={18}>{cd.Dosage}</Col>*/}
                        {/*<Col className={Styles.itemList} span={5}>注意事项：</Col>*/}
                        {/*<Col className={Styles.itemList} span={18}>{cd.Precautions}</Col>*/}
                        {/*<Col className={Styles.itemList} span={5}>不良反应：</Col>*/}
                        {/*<Col className={Styles.itemList} span={18}>{cd.AdverseReactions}</Col>*/}
                        {/*<Col className={Styles.itemList} span={5}>剂型规格：</Col>*/}
                        {/*<Col className={Styles.itemList} span={18}>{cd.FormulationSpecification}</Col>*/}
                        <Col className={Styles.itemList} span={5}>文章链接：</Col>
                        <Col className={Styles.itemList} span={18}>{cd.articleLink ? <a target='_blank' rel="nofollow me noopener noreferrer" href={cd.articleLink}>{cd.articleLink}</a> : '暂无链接' }</Col>
                    </Row>
                </Modal>
                <div className={Styles.erwema} style={datile}>
                    <img src='https://www.medebound.com/assets/images/new/codewechart.jpg' width='150' alt='美联医邦公众号'/>
                </div>
                <footer className={Styles.footer} style={datile}>
                   美联医邦 © Copyright Medebound 2019. All Rights Reserved.
                </footer>
            </div>
        );
    }
}