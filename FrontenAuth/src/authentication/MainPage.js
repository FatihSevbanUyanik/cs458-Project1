import React from "react";
import './sign-in.css';
import {Redirect} from 'react-router-dom';
import {CURRENT_USER} from "../util/constants";

class MainPage extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        if(localStorage.getItem(CURRENT_USER)) {
            return (
                <div className="container">
                    <div className="jumbotron">
                        <h2 className="display-4">Congratulations!</h2>
                        <p className="lead">This is the place where we keep the most important secret of Bilkent:
                                          </p>
                        <hr className="my-4"/>
                        <h1>No matter how hard you work, it's not enough for Bilkent!</h1>
                        <p>Now that you know the secret, you can listen to music from Spotify</p>
                        <button className="btn btn-primary btn-lg" role="button" onClick={this.props.onLogout}>Logout</button>
                    </div>
                </div>
             );
        }
        else
            return <Redirect to="/sign-in"></Redirect>
    }
}

export default MainPage;