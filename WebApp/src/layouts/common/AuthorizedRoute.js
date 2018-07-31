import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import LoadingIndicator from './LoadingIndicator';

import { connect } from 'react-redux' ;

class AuthorizedRoute extends React.Component {
    
    render() {
        const { component: Component, isLoading, isAuthenticated, currentUser, ...rest } = this.props;

        return (
            <Route {...rest} render={props => {
                if (isLoading) return <LoadingIndicator/>;
                return isAuthenticated
                    ? <Component {...props} currentUser={currentUser}/>
                    : <Redirect to="/auth/login" />;
            }} />
        ) ;
    }
}

const stateToProps = ({ userReducer }) => ({
    currentUser: userReducer.currentUser,
    isAuthenticated: userReducer.isAuthenticated,
    isLoading: userReducer.isLoading,
});

export default connect(stateToProps)(AuthorizedRoute);
