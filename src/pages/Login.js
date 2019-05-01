import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { login } from '../utils/AuthService';
import SignUp from './SignUp';
import Input from '../components/input/Input'
import { validationError } from '../utils/Request';
import Nav from '../components/nav/Nav';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      errors: []
    };

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    // Unset window variable If already set in dashboard scroll function
    window.onscroll = () => {}
  }

  onChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  validateForm() {

    let errors = [];

    if (this.state.username === '') {
      errors['username'] = 'Username must be not empty'
    }

    if (this.state.password === '') {
      errors['password'] = 'Password must be not empty'
    }

    this.setState({ errors: errors })

    return Object.keys(errors).length === 0;
  }

  login(e) {

    e.preventDefault();

    if (this.validateForm()) {

      login(this.state.username, this.state.password).then(function (ok) {

        if (ok) {
          browserHistory.push('/dashboard');
        }
        else {
          
          validationError('Username/Password invalids.')
        }
      }).catch(function (error) {
        //handleHttpResponse(error)
        console.log(error)
      });

    }
  }

  render() {

    return (

      <div>

        <Nav />

        <ul id="tabs" className="nav nav-tabs" role="tablist">
          <li className="nav-item">
            <a id="tab-A" href="#pane-A" className="nav-link active" data-toggle="tab" role="tab">Login</a>
          </li>
          <li className="nav-item">
            <a id="tab-B" href="#pane-B" className="nav-link" data-toggle="tab" role="tab">Sign Up</a>
          </li>
        </ul>

        <div id="content" className="tab-content" role="tablist">

          <div id="pane-A" className="card tab-pane fade show active" role="tabpanel" aria-labelledby="tab-A">

            <div id="collapse-A" className="collapse show" data-parent="#content" role="tabpanel" aria-labelledby="heading-A">

              <form className="form-signin">

                <div className="form-group">
                  <Input id="lusername" text="Username" onChange={this.onChangeUsername} type="text" value={this.state.username} />
                  <span style={{ color: "red" }}>{this.state.errors["username"]}</span>
                </div>

                <div className="form-group">
                  <Input id="lpassword" text="Password" onChange={this.onChangePassword} type="password" value={this.state.password} />
                  <span style={{ color: "red" }}>{this.state.errors["password"]}</span>
                </div>
               
                <button onClick={this.login} className="btn btn-lg btn-primary btn-block" type="button">Sign in</button>

              </form>

            </div>

          </div>

          <div id="pane-B" className="card tab-pane fade" role="tabpanel" aria-labelledby="tab-B">

            <div id="collapse-A" className="collapse show" data-parent="#content" role="tabpanel" aria-labelledby="heading-A">

              <div className="card-body">

                <SignUp />

              </div>
            </div>

          </div>

          <p className="mt-5 mb-3 text-muted text-center">&copy; Tiago R. 2018-2019</p>

        </div>

      </div >
    );
  }
}

export default Login;
