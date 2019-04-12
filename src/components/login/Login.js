import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router';
import { login } from '../../utils/AuthService';
import Alert from '../alert/Alert'

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
    };

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.login = this.login.bind(this);
  }

  onChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  login() {

    login(this.state.username, this.state.password).then(function (ok) {

      if (ok) {
        browserHistory.push('/dashboard');
      }
      else {

        const elem = <div className="alert alert-danger" role="alert"> Username/Password invalids. </div>;
        ReactDOM.render(elem, document.getElementById('errors'));

      }
    });
  }

  render() {

    return (

      <div className="text-center">



        <form className="form-signin">

          <div id="errors" />

          <img className="mb-4" src="/docs/4.3/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72" />

          <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>

          <label htmlFor="inputEmail" className="sr-only">Email address</label>

          <input onChange={this.onChangeUsername} type="text" id="inputEmail" className="form-control" placeholder="Username" required autoFocus />

          <label htmlFor="inputPassword" className="sr-only">Password</label>

          <input onChange={this.onChangePassword} type="password" id="inputPassword" className="form-control" placeholder="Password" required />

          <div className="checkbox mb-3">

            <label>
              <input type="checkbox" value="remember-me" /> Remember me
            </label>

          </div>

          <button onClick={this.login} className="btn btn-lg btn-primary btn-block" type="button">Sign in</button>

          <p className="mt-5 mb-3 text-muted">&copy; Tiago R. 2018-2019</p>

        </form>

      </div>
    );
  }
}

export default Login;
