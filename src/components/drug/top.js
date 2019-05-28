import React from "react";
import {Form, Input, Button, Radio, Divider} from 'antd';
import { filterRule } from '../../common';
const RadioGroup = Radio.Group;
class Top extends React.Component{

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.name = filterRule(values.name);
                this.props.getListData(values);
            }
        });
    }
    handleNewDrug = () => {
        this.props.showModal();
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item label="药品名称">
                    {getFieldDecorator('name', {
                        rules: [{ required: false, message: 'Please input your username!' }],
                    })(
                        <Input allowClear />
                    )}
                </Form.Item>
                <Form.Item label='上市情况'>
                    {getFieldDecorator('n', {
                        initialValue: 1,
                        rules: [{ required: false, message: 'Please input your Password!' }],
                    })(
                        <RadioGroup style={{ width: "100%" }}>
                            <Radio value={1}>全部</Radio>
                            <Radio value={3}>国内上市</Radio>
                            <Radio value={2}>国内未上市</Radio>
                        </RadioGroup>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" icon='search'> 查询 </Button>
                    <Button type="primary" icon='plus' className='addBTN' onClick={this.handleNewDrug}> 新增 </Button>
                </Form.Item>
                <Divider/>
            </Form>
        )
    }
}
export default Form.create({ name: 'horizontal_login' })(Top);

