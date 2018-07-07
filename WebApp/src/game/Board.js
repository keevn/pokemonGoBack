import React, {Component} from 'react';
import './Board.css';
import {Link} from 'react-router-dom';

import {Button, Layout, Menu, notification} from 'antd';

const {Content} = Layout;

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        return (
            <Content className="Board-container">

                <div className="Board-content">
                    board
                    {

                        this.props.currentUser ? ( <div className="user-profile">
                           ${this.props.currentUser.name}
                        </div>) : (<div>no user passed</div>)
                    }
                </div>

            </Content>

        );
    }


}

export default Board ;