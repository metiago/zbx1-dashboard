import React, { Component } from 'react';

import axios from 'axios';

import { USERS_URL } from "../utils/Request";
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
      errors: [],
    };

    this.onChangeName = this.onChangeName.bind(this)
    this.onChangeEmail = this.onChangeEmail.bind(this)

    this.findAllUsers = this.findAllUsers.bind(this)
    this.update = this.update.bind(this)
  }

  componentDidMount() {
    this.findAllUsers();
  }

  onChangeName(event) {
    // this.setState({ username: event.target.value }, () => this.validateForm());
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

    const match = this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

    if (!match) {
      errors['email'] = 'Field is invalid';
    }

    this.setState({ errors: errors })

    return Object.keys(errors).length === 0;
  }

  update(e) {

    e.preventDefault();

    if (this.validateForm()) {

      const form = {
        name: this.state.name,
        email: this.state.email
      }

      axios.put(`${USERS_URL}/${this.state.ID}`, form).then(function (response) {

        validationSuccess('Ok! Your account has been successfully updated.')

      }).catch(function (error) {

        handleHttpResponse(error.response)

      });
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
              <Input id="username" text="Username" type="text" value={this.state.username} disabled={true} />
              <span style={{ color: "red" }}>{this.state.errors["username"]}</span>
            </div>
          </div>
          <Button action={this.update} text="Send" clazz="btn btn-primary" />
        </form>
        
      </div>
    );
  }
}

export default Profile;
