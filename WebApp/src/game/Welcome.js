import React, {Component} from 'react';
import './Welcome.css';
import {Link} from 'react-router-dom';

import {Button, Layout, Menu, notification} from 'antd';

const {Content, Sider} = Layout;

class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        return (
            <Layout>
                <Sider width={200} style={{background: '#78b0ff'}}><Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{height: '100%', borderRight: 0}}
                >
                    <Menu.Item key="1">new game</Menu.Item>
                </Menu>
                </Sider>
                <Layout style={{padding: '0 24px 24px'}}>
                    <Content className="welcome-container">

                        <h1 className="page-title">Welcome to PokemonGoBack</h1>
                        <div className="welcome-content">

                        </div>

                    </Content> </Layout></Layout>


        );
    }


}

export default Welcome;