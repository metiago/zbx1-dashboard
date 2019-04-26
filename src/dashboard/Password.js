import React, { Component } from 'react';

import axios from 'axios';

import { USERS_URL } from "../utils/Request";
import Nav from '../components/nav/Nav'
import Input from '../components/input/Input'
import { handleHttpResponse, validationSuccess } from '../utils/Request'
import { getUserInfo } from '../utils/AuthService'
import Button from '../components/button/Button';

class Password extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ID: '',
      username: '',
      password: '',
      confirm_password: '',
      updated_password: '',
      errors: [],
    };

    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.onChangeUpdatedPassword = this.onChangeUpdatedPassword.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  findLoggedUser() {

    const that = this;

    const userInfo = getUserInfo()

    if (userInfo !== null) {

      this.setState({ disabled: true })

      axios.get(`${USERS_URL}/${userInfo.ID}`).then(function (response) {

        that.setState({ ID: response.data.id, username: response.data.username })

      }).catch(function (error) {
        console.log(error)
      })
    }
  }

  componentDidMount() {
    this.findLoggedUser()
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  onChangeConfirmPassword(event) {
    this.setState({ confirm_password: event.target.value });
  }

  onChangeUpdatedPassword(event) {
    this.setState({ updated_password: event.target.value });
  }

  validateForm() {

    let errors = [];

    if (this.state.password === '') {
      errors['password'] = 'Old password must be not empty'
    }

    if (this.state.confirm_password === '') {
      errors['confirm_password'] = 'New password must be not empty'
    }

    if (this.state.updated_password !== this.state.confirm_password) {
      errors['updated_password'] = 'Confirm password not match'
    }

    this.setState({ errors: errors })

    return Object.keys(errors).length === 0;
  }

  changePassword() {

    if (this.validateForm()) {

      const that = this

      axios.put(`${USERS_URL}/${this.state.ID}/update-password`,
        {
          username: this.state.username,
          password: this.state.password,
          confirm_password: this.state.confirm_password,
          updated_password: this.state.updated_password,
        }
      ).then(function (response) {

        that.setState({ disabled: true, password: '', confirm_password: '', updated_password: '' })
        validationSuccess('Ok! Your password has been successfully updated.')

      }).catch(function (error) {

        handleHttpResponse(error)

      });

    }
  }

  render() {

    return (

      <div>

        <Nav />

        <form>
          <div className="form-row">
            <div className="form-group col-md-12">
              <Input id="password" text="Old Password" onChange={this.onChangePassword} type="password" />
              <span style={{ color: "red" }}>{this.state.errors["password"]}</span>
            </div>
            <div className="form-group col-md-12">
              <Input id="confirm_password" text="New Password" onChange={this.onChangeConfirmPassword} type="password" />
              <span style={{ color: "red" }}>{this.state.errors["confirm_password"]}</span>
            </div>
            <div className="form-group col-md-12">
              <Input id="updated_password" text="Confirm Password" onChange={this.onChangeUpdatedPassword} type="password" />
              <span style={{ color: "red" }}>{this.state.errors["updated_password"]}</span>
            </div>
          </div>
          <Button action={this.changePassword} text="Send" clazz="btn btn-primary" />
        </form>
      </div>
    );
  }
}

export default Password;
