import React from "react";
import './sign-in.css';
import {Redirect} from 'react-router-dom';
import {RESET_TOKEN} from "../util/constants";
import {reset} from "../util/APIUtil";

class Reset extends React.Component{
    constructor(props) {
        super(props);
        this.state = {password1: '', password2: '', vPass1: '', vPass2: '', message: ''};
        this.handleChange = this.handleChange.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    clickHandler(){
        if(!this.handleValidation())
            return;

        const resetRequest = {
            token: localStorage.getItem(RESET_TOKEN),
            password: this.state.password1
        };

        reset(resetRequest)
            .then(response => {
                localStorage.removeItem(RESET_TOKEN);
                this.setState({message: 'ok'});

            }).catch(error => {
            if(error.message === 'Failed to fetch')
                this.setState({message: 'There is a problem with the server.'});
            else
                this.setState({message: error.message});
            console.log(error.message);
        });
    }

    render() {
        if(!localStorage.getItem(RESET_TOKEN) || this.state.message === 'ok') {
            return <Redirect to="/"/>
        }
        else
            return (
                <div className="container mt-5 pt-5">
                    <div className="row justify-content-center mt-5 pt-5" id="login-form">
                        <div className="col-6 pt-3 pb-3">
                            {
                                this.state.message === '' ? <></> :
                                    (<h2 className="text-center mt-2 mb-2" id="error-message">
                                        {this.state.message}
                                    </h2>)
                            }
                            <div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1">Password</label>
                                    <input type="password" className={this.state.vPass1 === '' ? "form-control" : "form-control is-invalid"}
                                           name="password1" id="exampleInputPassword1" placeholder="********"
                                           onChange={this.handleChange} value = {this.state.password1}/>
                                    <div className="invalid-feedback">{this.state.vPass1}</div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword2">Password Confirmation</label>
                                    <input type="password" className={this.state.vPass2 === '' ? "form-control" : "form-control is-invalid"}
                                           name="password2" id="exampleInputPassword2" placeholder="********"
                                           onChange={this.handleChange} value = {this.state.password2}/>
                                    <div className="invalid-feedback">{this.state.vPass2}</div>
                                </div>
                                <div className="text-right">
                                    <button type="submit" className="btn btn-primary" id="change-btn" onClick={this.clickHandler} >
                                        Change password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            );
    }

    handleValidation(){
        let isFormValid = true;

        if(this.state.password1 === ''){
            this.setState( {vPass1: 'You need to enter a password.'});
            isFormValid = false;
        }else if(this.state.password1.length < 6){
            this.setState( {vPass1: 'Your password is too short.'});
            isFormValid = false;
        }else
            this.setState({vPass: ''});

        if(this.state.password2 === this.state.password1){
            this.setState({vPass2: ''});
        }else{
            this.setState({vPass2: 'The passwords don\'t match.'});
            isFormValid = false;
        }

        return isFormValid;
    }
}

export default Reset;