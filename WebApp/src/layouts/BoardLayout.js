import React from 'react';
import {
    Link,
    Route,
    Switch,
    Redirect, withRouter
} from 'react-router-dom';

import {Layout, Menu} from 'antd';
import Welcome from "../game/Welcome";
import Board from "../game/Board";

const {Content, Sider} = Layout;

const BoardLayout = ({match,history}) => (

    <Layout  style={{height:"100vh",position: "fixed",
        top:70,
        right:0,left:0}}>
        <Sider width={150} style={{background: '#78b0ff'}}><Menu
            mode="inline"
            style={{height: '100%', borderRight: 0}}
            selectedKeys={[history.location.pathname]}
        >
            <Menu.Item key="/app/newGame"><Link to='/app/newGame'>New Game</Link></Menu.Item>
            <Menu.Item key="/app/test"><Link to='/app/test'>Test Area</Link></Menu.Item>
        </Menu>
        </Sider>
        <Content >
            <Switch>
                <Route path={`${match.path}/newGame`} component={Welcome}/>
                <Route path={`${match.path}/test`} component={Board}/>
                <Redirect to={`${match.path}/test`} />
            </Switch>
        </Content>
    </Layout>
);


export default withRouter(BoardLayout);