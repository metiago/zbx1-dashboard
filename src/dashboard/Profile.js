import React, { Component } from 'react';

import axios from 'axios';

import { SIGNUP_URL, USERS_URL } from "../utils/Request";
import Nav from '../components/nav/Nav'
import Input from '../components/input/Input'
import { handleHttpResponse, validationSuccess } from '../utils/Request'
import { getUserInfo } from '../utils/AuthService'
import Button from '../components/button/Button';

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ID: '',
      username: '',
      password: '',
      confirm_password: '',
      name: '',
      email: '',
      edit: false,
      errors: [],
    };

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.signup = this.signup.bind(this);

    this.findAllUsers = this.findAllUsers.bind(this);
  }

  componentDidMount() {
    this.findAllUsers();
  }

  onChangeUsername(event) {
    // this.setState({ username: event.target.value }, () => this.validateForm());
    this.setState({ username: event.target.value });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  onChangeConfirmPassword(event) {
    this.setState({ confirm_password: event.target.value });
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

    if (userInfo !== null) {

      this.setState({ disabled: true })

      axios.get(`${USERS_URL}/${userInfo.ID}`).then(function (response) {

        that.setState({ ID: response.data.id, username: response.data.username, password: response.data.password, name: response.data.name, email: response.data.email })
        that.setState({ edit: true });

      }).catch(function (error) {
        console.log(error)
      })
    }
  }

  validateForm() {

    let errors = [];

    if (this.state.username === '') {
      errors['username'] = 'Username must be not empty'
    }    

    if (this.state.name === '') {
      errors['name'] = 'Field must be not empty'
    }

    if (this.state.email === '') {
      errors['email'] = 'Field must be not empty'
    }
    else {
      let match = this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      if (!match) {
        errors['email'] = 'Field is invalid';
      }
    }

    if (this.state.password === '') {
      errors['password'] = 'Old password must be not empty'
    }

    if (this.state.confirm_password === '') {
      errors['confirm_password'] = 'New password must be not empty'
    }

    this.setState({ errors: errors })

    return Object.keys(errors).length === 0;
  }  

  signup(e) {

    e.preventDefault();

    if (this.validateForm()) {

      if (this.state.ID) {

        const form = {
          name: this.state.name,
          email: this.state.email,
          username: this.state.username,
        }

        axios.put(`${USERS_URL}/${this.state.ID}`, form).then(function (response) {

          validationSuccess('Ok! Your account has been successfully updated.')

        }).catch(function (error) {

          handleHttpResponse(error.response)

        });

      } else {

        const form = {
          name: this.state.name,
          email: this.state.email,
          username: this.state.username,
          password: this.state.password,
          confirm_password: this.state.confirm_password
        }

        axios.post(SIGNUP_URL, form).then(function (response) {

          validationSuccess('Thanks! Your account has been successfully created.')

        }).catch(function (error) {
          console.log(error)
        });
      }
    }
  }
 
  render() {

    return (

      <div>

        <Nav />

        <form>
          <div className="form-group">
            <Input id="name" text="Name" onChange={this.onChangeName} type="text" value={this.state.name} />
            <span style={{ color: "red" }}>{this.state.errors["name"]}</span>
          </div>
          <div className="form-group">
            <Input id="email" text="Email" onChange={this.onChangeEmail} type="email" value={this.state.email} />
            <small className="form-text text-muted">We'll never share your email with anyone else.</small>
            <span style={{ color: "red" }}>{this.state.errors["email"]}</span>
          </div>
          <div className="form-row">
            <div className="form-group col-md-12">
              <Input id="username" text="Username" onChange={this.onChangeUsername} type="text" value={this.state.username} />
              <span style={{ color: "red" }}>{this.state.errors["username"]}</span>

            </div>
          </div>

          {(!this.state.edit) &&

            <div className="form-row">
              <div className="form-group col-md-6">
                <Input id="password" text="Password" onChange={this.onChangePassword} type="password" disabled={this.state.disabled} />
                <span style={{ color: "red" }}>{this.state.errors["password"]}</span>
              </div>
              <div className="form-group col-md-6">
                <Input id="confirm_password" text="Confirm Password" onChange={this.onChangeConfirmPassword} type="password" disabled={this.state.disabled} />
                <span style={{ color: "red" }}>{this.state.errors["confirm_password"]}</span>
              </div>
            </div>
          }

          <Button action={this.signup} text="Send" clazz="btn btn-primary" />
        </form>
      </div>
    );
  }
}

export default Profile;
