import React,{Component} from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Pages
import LoginPage from '../user/login/Login';
import SignupPage from "../user/signup/Signup";


class  UnauthorizedLayout extends Component {

    render() {
        const { match, history } = this.props;

        return (
            <div className="unauthorized-layout">
                <Switch>
                    <Route path={`${match.path}/login`} render={(props) => <LoginPage history={history} {...props} />}/>
                    <Route path={`${match.path}/signup`} component={SignupPage}/>
                    <Redirect to={`${match.path}/login`} />
                </Switch>
            </div>
        );
    }

}

export default UnauthorizedLayout;