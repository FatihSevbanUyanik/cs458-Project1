import React from "react";
import "./sign-up.css";
import {signup} from "../util/APIUtil.js";
import {Redirect} from 'react-router-dom';
import {CURRENT_USER} from "../util/constants";

class SignUp extends React.Component{
    constructor(props) {
        super(props);
        this.state = {email1: '', email2 :'', password: '', username: '', day: '', month: '', year: '',
                      gender: '', checkbox1: '', checkbox2: false, failed: '', vEmail1: '', vEmail2: '', vPass: '',
                      vUsername: '', vDay: '', vMonth: '', vYear:'', vGender: '', vCheckbox2: '', message: ''};
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
        console.log(this.state);
        if(!this.handleValidation())
            return;

        const signUpRequest = {
            username: this.state.username,
            email: this.state.email1,
            password: this.state.password,
            birthDate: this.state.day + this.state.month + this.state.year,
            gender: this.state.gender
        };

        console.log(signUpRequest);
        signup(signUpRequest)
            .then(response => {
                console.log("r- "+ response);
                this.setState({message: 'ok'});
            }).catch(error => {
            console.log("e- "+ error.message);
            this.setState({message: error.message});
        });
    }

    render() {
        if (this.state.message === 'ok')
            return <Redirect to="/sign-in"></Redirect>

        if(localStorage.getItem(CURRENT_USER)) {
            return <Redirect to="/"/>
        }

        return(
            <div className="container">
                <div className="row justify-content-center  mt-1 pt-1">
                    <div className="col-6 pb-3">
                            <div className="text-center">
                                <img src={require('../assets/logo.png')} className="img-fluid pt-3 rounded-lg" alt=""/>
                            </div>
                            <h1 className="form-header text-center"> Sign up with e-mail </h1>
                            {
                                this.state.message === '' ? <></> :
                                    (<h2 className="text-center mt-2 mb-2">
                                        {this.state.message}
                                    </h2>)
                            }
                            <div className="form-group">
                                <label htmlFor="exampleFormControlInput1">Email address</label>
                                <input type="email" className={this.state.vEmail1 === '' ? "form-control":  "form-control is-invalid" }
                                       id="exampleFormControlInput1" name="email1"
                                       placeholder="example@gmail.com"  onChange={this.handleChange} value = {this.state.email1}/>
                                <div className="invalid-feedback">{this.state.vEmail1}</div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="exampleFormControlInput2">Email address confirmation</label>
                                <input type="email" className={this.state.vEmail2 === '' ? "form-control":  "form-control is-invalid" }
                                       id="exampleFormControlInput2" name="email2"
                                       placeholder="example@gmail.com"  onChange={this.handleChange} value = {this.state.email2}/>
                                <div className="invalid-feedback">{this.state.vEmail2}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" className={this.state.vPass === '' ? "form-control":  "form-control is-invalid" }
                                       id="exampleInputPassword1" name="password"
                                       placeholder="********"  onChange={this.handleChange} value = {this.state.password}/>
                                <div className="invalid-feedback">{this.state.vPass}</div>
                            </div>
                            <div className="form-group ">
                                <label htmlFor="exampleInputUsername">Username</label>
                                <input type="text" className={this.state.vUsername === '' ? "form-control":  "form-control is-invalid" }
                                       name="username" id="exampleInputUsername" placeholder="example123"  onChange={this.handleChange}
                                       value = {this.state.username}/>
                                <div className="invalid-feedback">{this.state.vUsername}</div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-12 mb-0 pb-0">
                                    <label htmlFor="inputDay">Birthday</label>
                                </div>
                                <div className="form-group col-4">
                                    <label htmlFor="inputDay">Day</label>
                                    <input type="text" className={this.state.vDay === '' ? "form-control":  "form-control is-invalid" }
                                           id="inputDay" placeholder="DD" name="day" onChange={this.handleChange} value = {this.state.day}/>
                                    <div className="invalid-feedback">{this.state.vDay}</div>
                                </div>
                                <div className="form-group col-4">
                                    <label htmlFor="inputMonth">Month</label>
                                    <select id="inputMonth" className={this.state.vMonth === '' ? "form-control":  "form-control is-invalid" }
                                            name="month" onChange={this.handleChange} value = {this.state.month}>
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                    <div className="invalid-feedback">{this.state.vMonth}</div>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="inputYear">Year</label>
                                    <input type="text" className={this.state.vYear === '' ? "form-control":  "form-control is-invalid" }
                                           id="inputYear" placeholder="YYYY" name="year" onChange={this.handleChange} value = {this.state.year}/>
                                    <div className="invalid-feedback">{this.state.vYear}</div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>What is your gender</label> <br/>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="gender"
                                           id="inlineRadio1" value="Man" onChange={this.handleChange}/>
                                        <label className="form-check-label" htmlFor="inlineRadio1">Male</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="gender"
                                           id="inlineRadio2" value="Woman" onChange={this.handleChange}/>
                                        <label className="form-check-label" htmlFor="inlineRadio2">Female</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="gender"
                                           id="inlineRadio3" value="Other" onChange={this.handleChange}/>
                                        <label className="form-check-label" htmlFor="inlineRadio3">Non-binary</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value={this.state.checkbox1}
                                           id="defaultCheck1" name="checkbox1" onChange={this.handleChange}/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Share my registration data with Spotify's content providers for marketing purposes.
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="form-check">
                                    <input className={this.state.checkbox2 === 'true' ? "form-check-input":  "form-check-input is-invalid" }
                                           type="checkbox" id="defaultCheck2" name="checkbox2" onChange={this.handleCheckbox}/>
                                        <label className="form-check-label" htmlFor="defaultCheck2">
                                            I agree to the Spotify terms & conditions and Privacy Policy.
                                        </label>
                                    <div className="invalid-feedback">{this.state.vCheckbox2}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="btn btn-primary" onClick={this.clickHandler}>Sign up</button>
                            </div>
                    </div>
                </div>
            </div>
        );

    }

    handleValidation(){
        let isFormValid = true;

        if(/.+@.+\.[A-Za-z]+$/.test(this.state.email1))
            this.setState({vEmail1: ''});
        else{
            this.setState({vEmail1: 'This email is invalid. Make sure it\'s written like example@email.com'});
            isFormValid = false;
        }

        if(this.state.email1 === this.state.email2){
            this.setState({vEmail2: ''});
        }else{
            this.setState({vEmail2: 'The email addresses don\'t match.'});
            isFormValid = false;
        }

        if(this.state.password === ''){
            this.setState( {vPass: 'You need to enter a password.'});
            isFormValid = false;
        }else if(this.state.password.length < 6){
            this.setState( {vPass: 'Your password is too short.'});
            isFormValid = false;
        }else
            this.setState({vPass: ''});

        if(this.state.username === ''){
            this.setState( {vUsername: 'Enter a username for your profile.'});
            isFormValid = false;
        }else
            this.setState({vUsername: ''});

        if(isNaN(this.state.day) || this.state.day < 1 || this.state.day > 31){
            this.setState( {vDay: 'Enter a valid day of the month.'});
            isFormValid = false;
        }else
            this.setState({vDay: ''});

        if(isNaN(this.state.year) || this.state.year < 1900 || this.state.year > 2020){
            this.setState( {vYear: 'Enter a valid year.'});
            isFormValid = false;
        }else
            this.setState({vYear: ''});

        if(this.state.checkbox2 === false){
            this.setState( {vCheckbox2: 'You need to accept Spotify terms & conditions.'});
            isFormValid = false;
        }else
            this.setState( {vCheckbox2: ''});

        return isFormValid;
    }
}

export default SignUp;