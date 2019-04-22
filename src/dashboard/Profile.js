import React, { Component } from 'react';

import axios from 'axios';

import Nav from '../components/nav/Nav'
import Input from '../components/input/Input'

import { handleHttpResponse, validationSuccess, validationError } from '../utils/Request'
import { getUserInfo } from '../utils/AuthService'

import Button from '../components/button/Button';
import { FormErrors } from '../components/error/FormErrors';
import ChangePassword from '../components/modal/ChangePassword';

// TODO Implment form to change my password
const AUTH_SIGNUP = 'http://localhost:5000/signup'
const USERS_URL = 'http://localhost:5000/api/v1/users'

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ID: '',
      username: '',
      password: '',
      confirm_password: '',
      updated_password: '',
      name: '',
      email: '',
      formErrors: { email: '', password: '' },
      formValid: false,
      emailValid: false,
      usernameValid: false,
      passwordValid: false,
      confirmPasswordValid: false,
      nameValid: false,
      disabled: false,
      modal: false
    };

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.signup = this.signup.bind(this);
    this.editPassword = this.editPassword.bind(this);
    this.changePassword = this.changePassword.bind(this);

    this.findAllUsers = this.findAllUsers.bind(this);
  }

  componentDidMount() {
    this.findAllUsers();
  }

  onChangeUsername(event) {
    const username = event.target.id;
    const value = event.target.value;
    this.setState({ [username]: value }, () => { this.validateField(username, value) });
  }

  onChangePassword(event) {
    const password = event.target.id;
    const value = event.target.value;
    this.setState({ [password]: value }, () => { this.validateField(password, value) });
  }

  onChangeConfirmPassword(event) {
    const confirmPassword = event.target.id;
    const value = event.target.value;
    this.setState({ [confirmPassword]: value }, () => { this.validateField(confirmPassword, value) });
  }

  onChangeName(event) {
    const name = event.target.id;
    const value = event.target.value;
    this.setState({ [name]: value }, () => { this.validateField(name, value) });
  }

  onChangeEmail(event) {
    const email = event.target.id;
    const value = event.target.value;
    this.setState({ [email]: value }, () => { this.validateField(email, value) });
  }

  validateField(fieldName, value) {

    let fieldValidationErrors = this.state.formErrors;
    let usernameValid = this.state.usernameValid;
    let passwordValid = this.state.passwordValid;
    let confirmPasswordValid = this.state.confirmPasswordValid;
    let nameValid = this.state.nameValid;
    let emailValid = this.state.emailValid;

    switch (fieldName) {
      case 'username':
        usernameValid = value.length >= 5;
        fieldValidationErrors.username = usernameValid ? '' : ' is too short';
        break;
      case 'password':
      case 'confirm_password':
        passwordValid = value.length >= 5;
        fieldValidationErrors.password = passwordValid ? '' : ' is too short';

        confirmPasswordValid = this.state.confirm_password === this.state.password;
        fieldValidationErrors.confirm_passoword = confirmPasswordValid ? '' : ' not match';
        break;
      case 'name':
        nameValid = value.length >= 5;
        fieldValidationErrors.name = nameValid ? '' : ' is too short';
        break;
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? '' : ' is invalid';
        break;
      default:
        break;
    }

    this.setState({
      formErrors: fieldValidationErrors, nameValid: nameValid, usernameValid: usernameValid, passwordValid: passwordValid, confirmPasswordValid: confirmPasswordValid, emailValid: emailValid
    }, this.validateForm);
  }

  validateForm() {
    this.setState({ formValid: this.state.usernameValid && this.state.passwordValid && this.state.confirmPasswordValid && this.state.emailValid && this.state.nameValid });
  }

  findAllUsers() {

    const that = this;

    const userInfo = getUserInfo()

    if (userInfo) {

      this.setState({disabled: true})

      axios.get(`${USERS_URL}/${userInfo.ID}`).then(function (response) {

        that.setState({ ID: response.data.id, username: response.data.username, password: response.data.password, name: response.data.name, email: response.data.email })
        that.setState({ formValid: true });

      }).catch(function (error) {
        console.log(error)
      })
    }
  }

  signup() {

    const form = {
      username: this.state.username,
      password: this.state.password,
      confirm_password: this.state.confirm_password,
      name: this.state.name,
      email: this.state.email
    }

    if (this.state.ID) {

      axios.put(`${USERS_URL}/${this.state.ID}`, form
        
      ).then(function (response) {

        validationSuccess('Ok! Your account has been successfully updated.')

      }).catch(function (error) {

        handleHttpResponse(error.response)

      });

    } else {

      axios.post(AUTH_SIGNUP, form).then(function (response) {

        validationSuccess('Thanks! Your account has been successfully created.')

      }).catch(function (error) {
        validationError(error.response)
        console.log(error)
        console.log(error.response)
      });
    }
  }

  editPassword() {
    
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  changePassword() {

    const that = this

    axios.put(`${USERS_URL}/${this.state.ID}/update-password`,
        {          
          username: this.state.username,
          password: this.state.password,
          confirm_password: this.state.confirm_password,
          updated_password: this.state.updated_password,
        }
      ).then(function (response) {

        that.editPassword()
        validationSuccess('Ok! Your password has been successfully updated.')

      }).catch(function (error) {

        handleHttpResponse(error.response)

      });
  }

  render() {

    return (

      <div>

        <Nav />

        <ChangePassword modal={this.state.modal} save={this.changePassword} close={this.editPassword} onChangePassword={this.onChangePassword} onChangeConfirmPassword={this.onChangeConfirmPassword}/>

        <FormErrors formErrors={this.state.formErrors}/>

        <form>
          <div className="form-row">
            <div className="form-group col-md-4">
              <Input id="username" text="Username" onChange={this.onChangeUsername} type="text" value={this.state.username} />
            </div>
            <div className="form-group col-md-4">
              <Input id="password" text="Password" onChange={this.onChangePassword} type="password" value={this.state.password} disabled={this.state.disabled}/>
            </div>
            <div className="form-group col-md-4">
              <Input id="confirm_password" text="Confirm Password" onChange={this.onChangeConfirmPassword} type="password" value={this.state.confirm_passoword} disabled={this.state.disabled}/>
              {this.state.disabled && <small className="form-text text-muted"> <a onClick={this.editPassword}> Change password</a> </small> }
            </div>
          </div>
          <div className="form-group">
            <Input id="name" text="Name" onChange={this.onChangeName} type="text" value={this.state.name} />
          </div>
          <div className="form-group">
            <Input id="email" text="Email" onChange={this.onChangeEmail} type="email" value={this.state.email} />
            <small className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <Button disabled={!this.state.formValid} signup={this.signup} text="Send" clazz="btn btn-primary" />
        </form>
      </div>
    );
  }
}

export default Profile;
