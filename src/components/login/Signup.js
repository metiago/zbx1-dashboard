import React, { Component } from 'react';
import ReactDOM from 'react-dom'

import axios from 'axios';

const AUTH_SIGNUP = 'http://localhost:5000/signup'

class Signup extends Component {

    constructor(props) {
        
        super(props);

        this.state = {
            username: null,
            password: null,
            name: null,
            email: null
        };

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.signup = this.signup.bind(this);
    }

    onChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    onChangeName(event) {
        this.setState({ name: event.target.value });
    }

    onChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    signup() {
        console.log(this.state)
        const res = axios.post(AUTH_SIGNUP,
            {
                username: this.state.username,
                password: this.state.password,
                name: this.state.name,
                email: this.state.email
            }
        );

        res.then(function (response) {

            const elem = <div className="alert alert-success" role="alert"> Thanks! Your account has been successfully created. </div>;
            ReactDOM.render(elem, document.getElementById('errors'));

        }).catch(function (error) {
            console.log(error)
            console.log(error.response)
        });
    }

    render() {

        return (

            <form>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputUsername">Username</label>
                        <input onChange={this.onChangeUsername} type="text" className="form-control" id="inputUsername" placeholder="Username" />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="inputPassword4">Password</label>
                        <input onChange={this.onChangePassword} type="password" className="form-control" id="inputPassword4" placeholder="Password" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="inputName">Name</label>
                    <input onChange={this.onChangeName} type="text" className="form-control" id="inputName" placeholder="Name" />
                </div>
                <div className="form-group">
                    <label htmlFor="inputEmail">Email</label>
                    <input onChange={this.onChangeEmail} type="email" className="form-control" id="inputEmail" placeholder="Email" />
                    <small className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <button onClick={this.signup} type="button" className="btn btn-primary">Send</button>
            </form>

        );
    }
}

export default Signup;
