import React, {Component} from 'react';
import './Welcome.css';
import Profile from '../user/profile/Profile';
import Board from './Board';
import {Link, Route,
    withRouter,
    Switch,
    Redirect} from 'react-router-dom';

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
                    <Menu.Item key="1" ><Link to='/Board1'>Start New Game</Link></Menu.Item>
                    <Menu.Item key="2" ><Link to='Board2'>Cards</Link></Menu.Item>
                </Menu>
                </Sider>
                <Layout style={{padding: '0 24px 24px'}}>
                    <Content className="welcome-container">

                        <div className="welcome-content">
                            <h1 className="page-title">Welcome to PokemonGoBack</h1>
                            <Switch>
                                <Route exact path="/"
                                       render={(props) => <Board currentUser={this.state.currentUser} {...props} />}>
                                </Route>
                                <Route path="/Board1"
                                       render={(props) => <Board  {...props}  />}>
                                </Route>
                                <Route path="Board2"
                                       render={(props) => <Board  {...props}  />}>
                                </Route>
                                <Redirect to="/Board2"/>
                            </Switch>
                        </div>

                    </Content>
                </Layout>
            </Layout>


        );
    }


}

export default withRouter(Welcome) ;