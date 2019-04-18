import React, { Component } from 'react';
import ReactDOM from 'react-dom'

import axios from 'axios';

import ProgressBar from '../components/progress/ProgressBar'
import Alert from '../components/alert/Alert'
import Nav from '../components/nav/Nav';
import Dropzone from '../components/dropzone/Dropzone';
import FileDetail from '../components/modal/FileDetail'

import { getUserInfo } from '../utils/AuthService'

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      loading: false,
      modal: false,
      fileID: null,
      modalTitle: null,
      fileOwner: null,
      fileCreated: null
    };

    this.detail = this.detail.bind(this)
    this.delete = this.delete.bind(this)
    this.upload = this.upload.bind(this)
  }

  findAllFiles() {
    const userInfo = getUserInfo()
    let that = this;
    const res = axios.get(`http://localhost:5000/api/v1/files/${userInfo.Username}`);
    res.then(function (res) {
      that.setState({ files: res.data.slice(0, 50) });
    }).catch(function (error) {
      console.log(error)
      console.log(error.response)
    });
  }
  
  componentDidMount() {
    this.findAllUsers();
    this.findAllFiles();
  }

  detail(data) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      fileID: data.id,
      modalTitle: data.name,
      fileOwner: data.username,
      fileCreated: data.created
    }));
  }

  delete(data) {
    console.log(data)
  }

  upload(files) {

    let that = this;

    // TODO: CHUNK UPLOAD FOR LARGE FILES        
    // let blob = files[0]
    // let BYTES_PER_CHUNK = parseInt(1048576, 10);
    // let SIZE = blob.size;
    // let NUM_CHUNKS = Math.max(Math.ceil(SIZE / BYTES_PER_CHUNK), 1);
    // let start = 0;
    // let end = BYTES_PER_CHUNK;

    const config = {

      onUploadProgress: function (progressEvent) {

        const uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));

        that.setState({ progressBarStyle: { width: `${uploadPercentage}%` }, progressBarValue: uploadPercentage, showProgressBar: true });
      }
    }

    for (let file of files) {

      let formdata = new FormData();
      formdata.append('file', file);

      console.log(file)

      axios.post('http://localhost:5000/api/v1/files/upload', formdata, config).then(function (response) {

        that.setState({ showProgressBar: false })
        that.findAll()
        that.handleHttpResponse(response)
      }).catch(function (error) {
        that.handleHttpResponse(error.response)
        that.setState({ showProgressBar: false })
      });
    }

    // while (start < SIZE) {

    //     formdata.append('file', blob.slice(start, end));
    //     formdata.append('name', blob.name);

    //     start = end;
    //     end = start + BYTES_PER_CHUNK;

    //     post('http://localhost:5000/api/v1/files/upload', formdata, config).then(function (response) {

    //         that.handleHttpResponse(response)

    //     }).catch(function (error) {
    //         that.handleHttpResponse(error.response)
    //         that.setState({ showProgressBar: false })
    //     });
    // }
  }

  handleHttpResponse(response) {
    console.log(response);
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

    const { files } = this.state;

    return (

      <div>

        <FileDetail modal={this.state.modal} fileID={this.state.fileID} title={this.state.modalTitle} username={this.state.fileOwner} created={this.state.fileCreated} detail={this.detail} delete={this.delete} />

        <Nav />

        <Dropzone upload={this.upload} />

        {

          (this.state.showProgressBar) ? <ProgressBar style={this.state.progressBarStyle} value={this.state.progressBarValue} /> : ''

        }

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
                    <a onClick={() => this.detail(data)}>Details</a>
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
