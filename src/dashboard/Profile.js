import React, { Component } from 'react';
import ReactDOM from 'react-dom'

import axios from 'axios';

import Nav from '../components/nav/Nav'

import { getUserInfo } from '../utils/AuthService'
import Signup from '../components/login/Signup';

const AUTH_SIGNUP = 'http://localhost:5000/signup'
const USERS_URL = 'http://localhost:5000/api/v1/users'

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ID: null,
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

    this.findAllUsers = this.findAllUsers.bind(this);
  }

  componentDidMount() {
    this.findAllUsers();
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

  findAllUsers() {

    const that = this;

    const userInfo = getUserInfo()

    axios.get(`${USERS_URL}/${userInfo.ID}`).then(function (response) {

      that.setState({ ID: response.data.id, username: response.data.username, password: response.data.password, name: response.data.name, email: response.data.email})

    }).catch(function (error) {
      console.log(error)
    })
  }

  signup() {

    if (this.state.ID) {

      axios.put(`${USERS_URL}/${this.state.ID}`,
        {
          username: this.state.username,
          password: this.state.password,
          name: this.state.name,
          email: this.state.email
        }
      ).then(function (response) {

        const elem = <div className="alert alert-success" role="alert"> OK! Your account has been successfully updated. </div>;
        ReactDOM.render(elem, document.getElementById('errors'));

      }).catch(function (error) {
        console.log(error)
        console.log(error.response)
      });

    } else {

      axios.post(AUTH_SIGNUP,
        {
          username: this.state.username,
          password: this.state.password,
          name: this.state.name,
          email: this.state.email
        }
      ).then(function (response) {

        const elem = <div className="alert alert-success" role="alert"> Thanks! Your account has been successfully created. </div>;
        ReactDOM.render(elem, document.getElementById('errors'));

      }).catch(function (error) {
        console.log(error)
        console.log(error.response)
      });
    }
  }

  render() {

    return (

      <div>

        <Nav />

        <Signup onChangeName={this.onChangeName} onChangeEmail={this.onChangeEmail} onChangeUsername={this.onChangeUsername} onChangePassword={this.onChangePassword} 
                signup={this.signup}
                username={this.state.username} name={this.state.name} email={this.state.email} password={this.state.password}/>

      </div>
    );
  }
}

export default Profile;
