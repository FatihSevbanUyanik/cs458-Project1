import React from "react";
import './sign-in.css';
import {forgot} from "../util/APIUtil.js"
import {Redirect} from 'react-router-dom';
import {CURRENT_USER} from "../util/constants.js"
import {RESET_TOKEN} from "../util/constants";

class Forgot extends React.Component{
    constructor(props) {
        super(props);
        this.state = {email: '', vEmail: '', message: ''};
        this.handleChange = this.handleChange.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    clickHandler(){
        if(!this.handleValidation())
            return;

        const forgotRequest = {
            email: this.state.email
        };

        forgot(forgotRequest)
            .then(response => {
                localStorage.setItem(RESET_TOKEN, response.data.resetToken);
                console.log(response);
                this.setState({message: 'ok'})
            }).catch(error => {
                if(error.message === 'Failed to fetch')
                    this.setState({message: 'There is a problem with the server.'});
                else
                    this.setState({message: error.message});
                console.log(error.message);
        });
    }

    render() {
        if(localStorage.getItem(CURRENT_USER)) {
            return <Redirect to="/"/>
        }else if(this.state.message === 'ok'){
            return <Redirect to="/reset" />
        }else
        return (
            <div className="container mt-5 pt-5">
                <div className="row justify-content-center mt-5 pt-5" id="forgot-form">
                    <div className="col-6 pt-3 pb-3">
                        {
                            this.state.message === '' ? <></> :
                                (<h2 className="text-center mt-2 mb-2" id="error-message">
                                    {this.state.message}
                                </h2>)
                        }
                        <div>
                            <div className="form-group ">
                                <label htmlFor="exampleInputUserId">Enter your e-mail</label>
                                <input type="text" className={this.state.vEmail === '' ? "form-control" : "form-control is-invalid"}
                                       name="email" id="exampleInputUserId" placeholder="example@gmail.com"
                                       onChange={this.handleChange} value = {this.state.email}/>
                                <div className="invalid-feedback">{this.state.vEmail}</div>
                            </div>


                            <div className="text-right">
                                <button type="submit" className="btn btn-primary" id="request-btn" onClick={this.clickHandler} >
                                    Send request
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

        if(this.state.email === ''){
            this.setState( {vEmail: 'Please enter your email.'});
            isFormValid = false;
        }else
            this.setState({vEmail: ''});

        return isFormValid;
    }
}

export default Forgot;