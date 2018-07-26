import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import LoadingIndicator from './LoadingIndicator';

import { connect } from 'react-redux' ;

class AuthorizedRoute extends React.Component {
    
    render() {
        const { component: Component, isLoading, isAuthenticated, ...rest } = this.props;

        return (
            <Route {...rest} render={props => {
                if (isLoading) return <LoadingIndicator/>;
                return isAuthenticated
                    ? <Component {...props} />
                    : <Redirect to="/auth/login" />;
            }} />
        ) ;
    }
}

const stateToProps = ({ userReducer }) => ({
    isAuthenticated: userReducer.isAuthenticated,
    isLoading: userReducer.isLoading,
});

export default connect(stateToProps)(AuthorizedRoute);
