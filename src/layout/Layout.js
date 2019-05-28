import React from 'react';
import { Layout, Menu, Icon, Avatar, Dropdown } from 'antd';
import {Route, Switch} from "react-router";
import { Link } from 'react-router-dom';
import Drug from "../components/drug";
import Admin from "../components/admin";
import Fda from "../components/fda";
import Disease from "../components/disease";
import Key from "../components/key";
import Statistics from '../components/statistics';
import Styles from './styles.module.css';
import NoMatch from "../noMatch";
import {interfaces, request} from "../interface";
const { Header, Sider, Content } = Layout;


export default class Layout_U extends React.Component{
    state = {
        collapsed: false,
        isrender: false,
    };

    componentDidMount() {
        this.check();
    }

    async check(value) {
        const {data} = await request(interfaces.adminCheck, {method: 'get'});
        if(!data.success) {
            this.props.history.push('/login');
        } else {
            this.setState({
                isrender: true
            })
        }
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    async loginOut() {
        const {data} = await request(interfaces.adminloginOut, {method: 'get'});
        if(data.success) {
            localStorage.removeItem('user');
            this.props.history.push('/login');
        }
    }

    render(){
        const menu = (
            <Menu>
                <Menu.Item><div onClick={() => this.loginOut()}>注销</div></Menu.Item>
            </Menu>
        );
        const user = localStorage.getItem('user');
        const { isrender } = this.state;
        return (
            isrender?
            <Layout  style={{minHeight: '100vh'}} >
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                >
                    <div className={Styles.logo}>
                        <a href='#/client' target='_blank' rel="nofollow me noopener noreferrer">
                            <img src={require('../images/logo_w_s.png')}  width='100%' alt='美联医邦'/>
                        </a>
                    </div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} >
                        <Menu.Item key="1">
                            <Link to='/admin/drug'>
                                <Icon type="experiment" />
                                <span>药品管理</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Link to='/admin/disease'>
                                <Icon type="database" />
                                <span>疾病管理</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Link to='/admin/statistics'>
                                <Icon type="bar-chart" />
                                <span>统计数据</span>
                            </Link>
                        </Menu.Item>
                        {
                            user && JSON.parse(user).role === 0 ?
                            <Menu.Item key="2">
                                <Link to='/admin/admin'>
                                    <Icon type="user" />
                                    <span>用户管理</span>
                                </Link>
                            </Menu.Item>
                            :''
                        }
                        {
                            user && JSON.parse(user).role === 0 ?
                            <Menu.Item key="3">
                                <Link to='/admin/key'>
                                    <Icon type="key" />
                                    <span>密钥管理</span>
                                </Link>
                            </Menu.Item>
                            :''
                        }
                        <Menu.Item key="4">
                            <Link to='/admin/fda'>
                                <Icon type="branches" />
                                <span>FDA数据管理</span>
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: '0 20px' }}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                        <div style={{ float: 'right' }}>
                            <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf', marginRight: '10px' }}>{JSON.parse(user).account}</Avatar>
                            <Dropdown overlay={menu}>
                                <span className="ant-dropdown-link" style={{ cursor: 'pointer' }}>
                                    {JSON.parse(user).account} <Icon type="down" />
                                </span>
                            </Dropdown>
                        </div>

                    </Header>
                    <Content style={{
                        margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280,
                    }}
                    >
                        <Switch>
                            <Route exact path="/admin/drug"  component={Drug}/>
                            <Route exact path="/admin/disease"  component={Disease}/>
                            <Route exact path="/admin/admin"  component={Admin}/>
                            <Route exact path="/admin/key"  component={Key}/>
                            <Route exact path="/admin/statistics"  component={Statistics}/>
                            <Route exact path="/admin/fda"  component={Fda}/>
                            <Route exact component={NoMatch}/>
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
            :''
        )
    }
}


