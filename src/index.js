import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './public.css';
import { LocaleProvider } from 'antd';
import {interfaces, request} from "./interface";
import Root from './router';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

export default class Index extends React.Component{
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    componentDidMount() {
        request(interfaces.home, {method: 'get'});
    }

    render(){
        return (
            <LocaleProvider locale={zh_CN}><Root /></LocaleProvider>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
