import React from "react";
import {Form, Icon, Input, Button, Checkbox, message} from 'antd';
import { Chart, Tooltip, Axis, Bar } from 'viser-react';
import Styles from './styles.module.css';
import {interfaces, request} from "../../interface";

const data = [
    { year: '1951 年', sales: 38 },
    { year: '1952 年', sales: 52 },
    { year: '1956 年', sales: 61 },
    { year: '1957 年', sales: 145 },
    { year: '1958 年', sales: 48 },
    { year: '1959 年', sales: 38 },
    { year: '1960 年', sales: 38 },
    { year: '1962 年', sales: 38 },
  ];
  
  const scale = [{
    dataKey: 'sales',
    tickInterval: 40,
  }];

export default class Statistics extends React.Component{

    state = {
        hotDrug: []
    }
    componentDidMount() {
        this.getHotDrugList();
    }

    async getHotDrugList() {
        const {data} = await request(interfaces.getHotDrug, {});
        this.setState({
            hotDrug: data.results || [],
        });
    }
    render() {
        const { hotDrug } = this.state;
        return (
            <div>
                <h3>药品信息统计</h3>
                <br/>
                <Chart height={400} data={data} scale={scale} padding={{top: 20, right: 30, bottom: 20, left: 30}}>
                    <Tooltip />
                    <Axis />
                    <Bar position="year*sales" />
                </Chart>
            </div>
        )
    }
}