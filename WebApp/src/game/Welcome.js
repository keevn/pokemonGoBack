import React, {Component} from 'react';
import {checkUsernameAvailability, checkEmailAvailability} from '../util/APIUtils';
import './Welcome.css';
import {Link} from 'react-router-dom';

import {Button, notification} from 'antd';

class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        return (
            <div className="welcome-container">
                <h1 className="page-title">Welcome to PokemonGoBack</h1>
                <div className="welcome-content">
                    <Button>Start new Game</Button>
                </div>
            </div>
        );
    }


}

export default Welcome;