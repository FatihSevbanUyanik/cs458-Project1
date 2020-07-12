import React from "react";
import './sign-in.css';
import {login} from "../util/APIUtil.js"
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom'
import {CURRENT_USER, REMEMBER_ME, EMAIL_OR_USERNAME, PASSWORD} from "../util/constants";

class SignIn extends React.Component{
    constructor(props){
        super(props);
        this.state = {emailOrUsername: '', password: '', remember: false, message: '',
                      vEmail: '', vPass: ''};
        if (localStorage.getItem(REMEMBER_ME)){
            this.state.emailOrUsername = localStorage.getItem(EMAIL_OR_USERNAME);
            this.state.password = localStorage.getItem(PASSWORD);
            this.state.remember = true;
        }
        this.handleChange = this.handleChange.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
    }


    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    handleCheckbox(event){
        this.setState({[event.target.name]: event.target.checked});
    }

    clickHandler(){
        if(!this.handleValidation())
            return;

        const loginRequest = {
            emailOrUsername: this.state.emailOrUsername,
            password: this.state.password
        };

        if (this.state.remember === true){
            localStorage.setItem(REMEMBER_ME, 'true');
            localStorage.setItem(EMAIL_OR_USERNAME, this.state.emailOrUsername)
            localStorage.setItem(PASSWORD, this.state.password);
        }
        else{
            localStorage.removeItem(REMEMBER_ME);
            localStorage.removeItem(EMAIL_OR_USERNAME);
            localStorage.removeItem(PASSWORD);
        }

        login(loginRequest)
            .then(response => {
                this.props.onLogin(response.data.user, response.data.token);
            }).catch(error => {
                if(error.message === 'Failed to fetch')
                    this.setState({message: 'There is a problem with the server.'});
                else
                    this.setState({message: error.message});
                console.log(error.message);
        });
    }

    render()
    {
        if(localStorage.getItem(CURRENT_USER)) {
            return <Redirect to="/"/>
        }

        return(
            <div className="container mt-5 pt-5">
                <div className="row justify-content-center mt-5 pt-5" id="login-form">
                    <div className="col-6 pb-3">
                        <div className="text-center">
                            <img src={require('../assets/logo.png')} className="img-fluid pt-3 rounded-lg" alt=""/>
                        </div>
                        {
                            this.state.message === '' ? <></> :
                                (<h2 className="text-center mt-2 mb-2" id="error-message">
                                    {this.state.message}
                                </h2>)
                        }
                        <div>
                                <div className="form-group ">
                                    <label htmlFor="exampleInputUserId">E-mail or username</label>
                                    <input type="text" className={this.state.vEmail === '' ? "form-control" : "form-control is-invalid"}
                                           name="emailOrUsername" id="exampleInputUserId" placeholder="example@gmail.com or example123"
                                           onChange={this.handleChange} value = {this.state.emailOrUsername}/>
                                   <div className="invalid-feedback" id="vEmailMessage">{this.state.vEmail}</div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1">Password</label>
                                    <input type="password" className={this.state.vPass === '' ? "form-control" : "form-control is-invalid"}
                                           name="password" id="exampleInputPassword1" placeholder="********"
                                           onChange={this.handleChange} value = {this.state.password}/>
                                    <div className="invalid-feedback" id="vPassMessage">{this.state.vPass}</div>
                                </div>
                                <div className="form-group">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" onChange={this.handleCheckbox}
                                               name="remember" id="gridCheck" checked={this.state.remember}/>
                                        <label className="form-check-label" htmlFor="gridCheck">
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <button type="submit" className="btn btn-primary" id="login-btn"onClick={this.clickHandler} >
                                        Login
                                    </button>
                                </div>
                                <div className="text-center">
                                    <Link to="/forgot" id="forgot">
                                        Forgot your password?
                                    </Link>
                                </div>
                                <hr/>
                                <div className="text-center">
                                    <h3>Don't have an account?</h3>
                                    <Link to="/sign-up" id="sign-up">
                                        Sign up for Spotify
                                    </Link>
                                </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }

    handleValidation(){
        let isFormValid = true;

        if(this.state.password === ''){
            this.setState( {vPass: 'Please enter your password.'});
            isFormValid = false;
        }else
            this.setState({vPass: ''});

        if(this.state.emailOrUsername === ''){
            this.setState( {vEmail: 'Please enter your Spotify username or email address.'});
            isFormValid = false;
        }else
            this.setState({vEmail: ''});

        return isFormValid;
    }
}

export default SignIn;