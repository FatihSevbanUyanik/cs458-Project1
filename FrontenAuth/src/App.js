import React from 'react';
import './App.css';
import SignIn from "./authentication/sign-in";
import SignUp from "./authentication/sign-up";
import Forgot from "./authentication/forgot";
import MainPage from "./authentication/MainPage";
import {Route, withRouter, Switch} from 'react-router-dom';
import { ACCESS_TOKEN, CURRENT_USER, REMEMBERME} from './util/constants.js';
import Reset from "./authentication/reset";

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.handleLogin = this.handleLogin.bind(this)
    }

    componentWillMount(){
        if (!localStorage.getItem(REMEMBERME)){
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(CURRENT_USER);
        }
    }

    handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(CURRENT_USER);
        this.setState({
            currentUser: null,
            isAuthenticated: false
        });
        console.log("You're successfully logged out.");
        this.props.history.push("/sign-in");

    }

    handleLogin(user, token) {
        console.log(user);
        console.log(token);
        localStorage.setItem(ACCESS_TOKEN, token);
        localStorage.setItem(CURRENT_USER, user);
        this.setState({
            currentUser: user,
            isAuthenticated: true
        });
        this.props.history.push("/");
    }

    render() {
        return (
            <Switch>
                <Route path="/sign-in"
                  render={
                      (props) => <SignIn isAuthenticated={this.state.isAuthenticated}
                                         currentUser={this.state.currentUser} onLogin={this.handleLogin} {...props} />
                  }>
                </Route>
                <Route path="/sign-up"
                       render={
                           (props) => <SignUp isAuthenticated={this.state.isAuthenticated}
                                              currentUser={this.state.currentUser} {...props} />
                       }>
                </Route>
                <Route path="/forgot"
                    render={
                        (props) => <Forgot  isAuthenticated={this.state.isAuthenticated}
                                            currentUser={this.state.currentUser} {...props} />
                    }>
                </Route>
                <Route path="/reset"
                    render={
                        (props) => <Reset  isAuthenticated={this.state.isAuthenticated}
                                            currentUser={this.state.currentUser} {...props} />
                    }>
                </Route>
                <Route path="/"
                       render={
                           (props) => <MainPage isAuthenticated={this.state.isAuthenticated} onLogout={this.handleLogout}
                                              currentUser={this.state.currentUser} {...props} />
                       }>
                </Route>
            </Switch>
        );
    }


}


export default withRouter(App);
