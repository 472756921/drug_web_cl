import React from "react";
import {Form, Icon, Input, Button, Checkbox, message} from 'antd';
import Styles from './styles.module.css';
import {interfaces, request} from "../../interface";

class Login extends React.Component{
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.Login(values);
            }
        });
    }

    async Login(value) {
        const {data} = await request(interfaces.adminLogin, {method: 'POST', body:value});
        if(data.code === 200) {
            this.props.history.push('/admin/drug');
            localStorage.setItem('user',JSON.stringify(data.data));
        } else {
            message.error(data.message || '网络开小差了，请稍后再试');
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={Styles.login}>
                <div className={Styles.loginContent}>
                    <h2>新药查询后台管理系统</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: false,
                            })(
                                <Checkbox style={{color: '#fff'}}>Remember me</Checkbox>
                            )}
                            <br/>
                            <Button block type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create({ name: 'normal_login' })(Login);