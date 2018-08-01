import React, {Component} from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import {Layout, Menu, Dropdown, Icon} from 'antd';
import {connect} from "react-redux";

import {handleLogout} from "../../util/APIUtils";

const Header = Layout.Header;

class AppHeader extends Component {
    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick({key}) {

        const { history } = this.props;

        if (key === "logout") {
            handleLogout({history});
        }
    }


    render() {
        let menuItems;

        if (this.props.currentUser) {
            menuItems = [
                <Menu.Item key="/">
                    <Link to="/app">
                        <Icon type="home" className="nav-icon"/>
                    </Link>
                </Menu.Item>,
                <Menu.Item key="/profile" className="profile-menu">
                    <ProfileDropdownMenu
                        currentUser={this.props.currentUser}
                        handleMenuClick={this.handleMenuClick}/>
                </Menu.Item>
            ];
        } else {
            menuItems = [
                <Menu.Item key="/login">
                    <Link to="/auth/login">Login</Link>
                </Menu.Item>,
                <Menu.Item key="/signup">
                    <Link to="/auth/signup">Signup</Link>
                </Menu.Item>
            ];
        }

        return (
            <Header className="app-header">
                <div className="container">
                    <div className="app-title">
                        <Link to="/">PokemonGoBack Online</Link>
                    </div>
                    <Menu
                        className="app-menu"
                        mode="horizontal"
                        selectedKeys={[this.props.location.pathname]}
                        style={{lineHeight: '64px'}}>
                        {menuItems}
                    </Menu>
                </div>
            </Header>
        );
    }
}

function ProfileDropdownMenu(props) {
    const dropdownMenu = (
        <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
            <Menu.Item key="user-info" className="dropdown-item" disabled>
                <div className="user-full-name-info">
                    {props.currentUser.name}
                </div>
                <div className="username-info">
                    <Icon type="idcard" /> @{props.currentUser.username}
                </div>
            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="profile" className="dropdown-item">
                <Link to={`/app/users/${props.currentUser.username}`}><Icon type="profile" />Profile</Link>
            </Menu.Item>
            <Menu.Item key="logout" className="dropdown-item">
                <Icon type="logout" /> Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown
            overlay={dropdownMenu}
            trigger={['click']}
            getPopupContainer={() => document.getElementsByClassName('profile-menu')[0]}>
            <a className="ant-dropdown-link">
                <Icon type="user" className="nav-icon" style={{marginRight: 0}}/> <Icon type="down"/>
            </a>
        </Dropdown>
    );
}


const stateToProps = ({ userReducer }) => ({
    currentUser:userReducer.currentUser,
    isAuthenticated: userReducer.isAuthenticated
});

export default withRouter(connect(stateToProps)(AppHeader));