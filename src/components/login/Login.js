import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router';

import Signup from "./Signup";
import { login } from '../../utils/AuthService';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null
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

      <div>

        <div id="errors" />

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
                  <label htmlFor="inputEmail" className="sr-only">Email address</label>
                  <input onChange={this.onChangeUsername} type="text" id="inputEmail" className="form-control" placeholder="Username" required autoFocus />
                </div>

                <div className="form-group">
                  <label htmlFor="inputPassword" className="sr-only">Password</label>
                  <input onChange={this.onChangePassword} type="password" id="inputPassword" className="form-control" placeholder="Password" required />
                </div>

                <button onClick={this.login} className="btn btn-lg btn-primary btn-block" type="button">Sign in</button>

              </form>

            </div>

          </div>

          <div id="pane-B" className="card tab-pane fade" role="tabpanel" aria-labelledby="tab-B">

            <div id="collapse-A" className="collapse show" data-parent="#content" role="tabpanel" aria-labelledby="heading-A">

              <div className="card-body">
              
              <Signup/>

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
