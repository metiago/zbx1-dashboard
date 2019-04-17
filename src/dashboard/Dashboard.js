import React, { Component } from 'react';
import axios from 'axios';

import Nav from '../components/nav/Nav';
import Dropzone from '../components/dropzone/Dropzone';
import { findAll } from '../utils/FileService'
import { getIdToken } from '../utils/AuthService'


class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      loading: false
    };
  }

  findAll() {
    let that = this;
    findAll().then(function (res) {
      that.setState({ files: res.data.slice(0, 50) });
    }).catch(function (error) {
      console.log(error.response)
    });
  }

  componentDidMount() {

    let self = this;

    axios.interceptors.request.use(async (config) => {

      config.headers.Authorization = getIdToken()
    
      self.setState({loading: true})
    
      return config;
    
    }, (error) => {
      self.setState({loading: false})
      return Promise.reject(error);
    });
    
    axios.interceptors.response.use(function (response) {
    
      self.setState({loading: false})
      
      return response;
    
    }, function (error) {
      self.setState({loading: false})
    
      return Promise.reject(error);
    });

    this.findAll();
  }

  render() {

    const { files } = this.state;

    return (

      <div>

        <Nav loading={this.state.loading}/>

        <Dropzone />

        <main>

          <div id="loader" />

          <div className="my-3 p-3 bg-white rounded shadow-sm">

            <h6 className="border-bottom border-gray pb-2 mb-0">My Files</h6>

            {files.map((data, index) => (
              <div className="media text-muted pt-3" key={index}>
                <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff" /><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
                <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <strong className="text-gray-dark">{data.name}</strong>
                    <a>Details</a>
                  </div>
                  <span className="d-block">@{data.username}</span>
                </div>
              </div>
            ))
            }

            <small className="d-block text-right mt-3">
              <a>Show All</a>
            </small>
          </div>

        </main>

      </div>
    );
  }
}

export default Dashboard;
