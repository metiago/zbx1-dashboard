import React, { Component } from 'react';

import axios from 'axios';

import Nav from '../components/nav/Nav'

import { getUserInfo } from '../utils/AuthService'
import Signup from '../components/login/Signup';

const USERS_URL = 'http://localhost:5000/api/v1/users'

class Profile extends Component {

  constructor(props) {
    super(props);
    this.findAllUsers = this.findAllUsers.bind(this);
  }
 
  findAllUsers() {

    const userInfo = getUserInfo()
    
    axios.get(`${USERS_URL}/${userInfo.ID}`).then(function (response) {

    }).catch(function (error) {
      console.log(error)
    })
  }

  componentDidMount() {
    this.findAllUsers();
  }

  render() {


    return (

      <div>

          <Nav />

          <Signup />
       
      </div>
    );
  }
}

export default Profile;
