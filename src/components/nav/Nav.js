import React, { Component } from 'react';

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
                {
                  (isLoggedIn()) ? (<a className="nav-link" href='/dashboard'> <i className="fab fa-buromobelexperte"></i> Dashboard </a>) : ''
                }
              </li>
              <li className="nav-item dropdown active">
                {
                  (isLoggedIn()) ? (<a className="nav-link" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="fas fa-cog"></i> Settings </a>) : ''
                }
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <a className="dropdown-item" href="/profile">Profile</a>
                  <a className="dropdown-item" href="/password">Password</a>
                  <hr />
                  {
                    (isLoggedIn()) ? (<a className="dropdown-item" onClick={() => logout()}>Log out </a>) : (<a className="dropdown-item" onClick={() => login()}>Log In</a>)
                  }
                </div>
              </li>
            </ul>
          </div>

          <div id="loader" />
        </nav>

        <div id="alert" />

      </div>
    );
  }
}

export default Nav;
