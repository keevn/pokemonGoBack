import React from 'react';
import {
    Link,
    Route,
    Switch,
    Redirect, withRouter
} from 'react-router-dom';

import Profile from '../user/profile/Profile';

import {Layout, Menu,Icon} from 'antd';
import Welcome from "../game/Welcome";
import Board from "../game/Board";
import Loop from "../game/Game";

const {Content, Sider} = Layout;

const BoardLayout = ({match,history,currentUser}) => (

    <Layout  style={{height:"100vh",position: "fixed",
        top:70,
        right:0,left:0}}>
        <Sider width={150} style={{background: '#78b0ff'}}><Menu
            mode="inline"
            style={{height: '100%', borderRight: 0}}
            selectedKeys={[history.location.pathname]}
        >
            <Menu.Item key="/app/newGame"><Link to='/app/newGame'><Icon type="chrome" /><span>New Game</span></Link></Menu.Item>
            <Menu.Item key={`/app/users/${currentUser.username}`}><Link to={`/app/users/${currentUser.username}`}><Icon type="user" /><span>User Info</span></Link></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="/app/test"><Link to='/app/test'><Icon type="solution" /><span>Test Area</span></Link></Menu.Item>
            <Menu.Item key="/app/testLoop"><Link to='/app/testLoop'><Icon type="solution" /><span>Test Loop</span></Link></Menu.Item>
        </Menu>
        </Sider>
        <Content >
            <Switch>
                <Route path={`${match.path}/users/:username`} render={(props) => <Profile {...props} />} />
                <Route path={`${match.path}/newGame`} component={Welcome}/>
                <Route path={`${match.path}/test`} render={(props) =>{

                    console.log(props);
                    return <Board {...props} currentUser={currentUser}/>;
                } } />
                <Route path={`${match.path}/testLoop`} render={(props) =>{

                    //console.log(props);
                    return <Loop {...props} currentUser={currentUser}/>;
                } } />

                <Redirect to={`${match.path}/test`} />
            </Switch>
        </Content>
    </Layout>
);


export default withRouter(BoardLayout);