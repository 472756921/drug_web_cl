import React from 'react';
import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';
import Layout from './layout/Layout';

import Login from './components/login';
import Client from './components/client';
import NoMatch from './noMatch';


export default class Index extends React.Component{
    render(){
        return (
            <HashRouter>
                <Switch>
                    <Route path="/admin" component={Layout}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/client" component={Client}/>
                    <Route exact path="/" component={Client}/>
                    <Route exact component={NoMatch}/>
                </Switch>
            </HashRouter>
        )
    }
}