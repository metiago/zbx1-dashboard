import React, { Component } from 'react';

import axios from 'axios';

import Nav from '../components/nav/Nav'
import Input from '../components/input/Input'

import { handleHttpResponse, validationSuccess } from '../utils/Request'
import { getUserInfo } from '../utils/AuthService'

import Button from '../components/button/Button';

const AUTH_SIGNUP = 'http://localhost:5000/signup'
const USERS_URL = 'http://localhost:5000/api/v1/users'

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ID: '',
      username: '',
      password: '',
      name: '',
      email: ''
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

    if (userInfo) {

      axios.get(`${USERS_URL}/${userInfo.ID}`).then(function (response) {

        that.setState({ ID: response.data.id, username: response.data.username, password: response.data.password, name: response.data.name, email: response.data.email })

      }).catch(function (error) {
        console.log(error)
      })
    }
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
      
        handleHttpResponse(response)

      }).catch(function (error) {
        console.log(error)
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
          
        validationSuccess('Thanks! Your account has been successfully created.')

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
        
        <form>
          <div className="form-row">
            <div className="form-group col-md-6">
              <Input id="username" text="Username" onChange={this.onChangeUsername} type="text" value={this.state.username} />
            </div>
            <div className="form-group col-md-6">
              <Input id="password" text="Password" onChange={this.onChangePassword} type="password" value={this.state.password} />
            </div>
          </div>
          <div className="form-group">
            <Input id="name" text="Name" onChange={this.onChangeName} type="text" value={this.state.name} />
          </div>
          <div className="form-group">
            <Input id="email" text="Email" onChange={this.onChangeEmail} type="email" value={this.state.email} />
            <small className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <Button signup={this.signup} text="Send" clazz="btn btn-primary" />
        </form>
      </div>
    );
  }
}

export default Profile;
