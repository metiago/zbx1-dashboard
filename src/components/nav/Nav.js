import React, { Component } from 'react';
import { login, logout, isLoggedIn } from '../../utils/AuthService';
import Loader from 'react-loader-spinner'

class Nav extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (

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
        { this.props.loading &&
          <Loader type="TailSpin" color="#FFFFFF" height="30" width="30" />
        }
      </nav>
    );
  }
}

export default Nav;
