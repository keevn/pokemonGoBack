import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Profile from '../user/profile/Profile';
import BoardLayout from "./BoardLayout";

const DefaultLayout = ({ match,currentUser }) => (
    <div className="primary-layout">
            <Switch>
               {/* <Route path={`${match.path}/users/:username`} render={(props) => <Profile {...props} />}/>*/}
                <Route path={`${match.path}`}  render={(props) => <BoardLayout {...props} currentUser={currentUser}/>} />
                <Redirect to={`${match.url}`} />
            </Switch>
    </div>
)

export default DefaultLayout ;