import React, {Component} from 'react';
import './App.css';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import AuthorizedRoute from '../layouts/common/AuthorizedRoute';

// Layouts
import UnauthorizedLayout from '../layouts/UnauthorizedLayout';
import DefaultLayout from '../layouts/DefaultLayout';


import AppHeader from '../layouts/common/AppHeader';

import {Layout, notification} from 'antd';

const {Content} = Layout;

class App extends Component {
    constructor(props) {
        super(props);

        notification.config({
            placement: 'bottomRight',
            bottom: 10,
            duration: 1,
        });
    }

    render() {

        return (
            <Layout className="app-container">
                <AppHeader/>

                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route path="/auth" component={UnauthorizedLayout} />
                            <AuthorizedRoute path="/app" component={DefaultLayout} />
                            <Redirect to="/auth" />
                        </Switch>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default App;
