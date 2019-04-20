import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import Loader from 'react-loader-spinner'

import axios from 'axios';

import Alert from '../alert/Alert'
import { getToken } from '../../utils/AuthService'
import { login, logout, isLoggedIn } from '../../utils/AuthService';

class Nav extends Component {

  constructor(props) {
    super(props);

    this.state = {
      progressBarStyle: null,
      progressBarValue: 0,
      showProgressBar: false
    };
  }

  componentDidMount() {

    let self = this;

    axios.interceptors.request.use(async (config) => {

      config.headers.Authorization = getToken()

      self.setState({ loading: true })

      return config;

    }, (error) => {
     
      self.setState({ loading: false })
      return Promise.reject(error);
    });

    axios.interceptors.response.use(function (response) {

      // FIXME it only should be called in button actions
      self.handleHttpResponse(response)

      self.setState({ loading: false })

      return response;

    }, function (error) {
      
      self.handleHttpResponse(error.response)
      self.setState({ loading: false })

      return Promise.reject(error);
    });

  }

  handleHttpResponse(response) {
    let clazz = null;
    let status = null;
    let message = null;
    switch (response.status) {
      case 200:
      case 201:
        clazz = 'alert alert-success'
        status = response.status
        message = response.statusText
        break;
      case 403:
        clazz = 'alert alert-warning'
        status = response.status
        message = response.statusText
        break;
      case 400:
        clazz = 'alert alert-warning'
        status = response.status
        message = response.data.message
        break;
      case 500:
        clazz = 'alert alert-danger'
        status = response.status
        message = response.statusText
        break;
    }

    ReactDOM.render(
      <Alert clazz={clazz} status={status} message={message} />, document.getElementById('errors')
    );
  }

  render() {

    return (

      <div>

        <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
          <a className="navbar-brand" href="/dashboard">ZBX1</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <a className="nav-link" href="/dashboard">Dashboard</a>
              </li>
              <li className="nav-item dropdown active">
                <a className="nav-link" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Settings
              </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <a className="dropdown-item" href="/profile">Profile</a>
                  <hr />
                  {
                    (isLoggedIn()) ? (<a className="dropdown-item" onClick={() => logout()}>Log out </a>) : (<a className="dropdown-item" onClick={() => login()}>Log In</a>)
                  }
                </div>
              </li>
            </ul>
          </div>
          {this.state.loading &&
            <Loader type="TailSpin" color="#FFFFFF" height="30" width="30" />
          }
        </nav>

        <div id="errors" />

      </div>
    );
  }
}

export default Nav;
