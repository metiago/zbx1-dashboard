import React, { Component } from 'react';

import axios from 'axios';

import { FILES_URL } from "../utils/Request";
import ProgressBar from '../components/progress/ProgressBar'
import Nav from '../components/nav/Nav';
import Dropzone from '../components/dropzone/Dropzone';
import FileDetail from '../components/modal/FileDetail'
import { validationError, validationSuccess } from '../utils/Request'
import { getUserInfo } from '../utils/AuthService'

const MAX_FILE_SIZE_IN_BYTES = 16000000

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      page: 1,
      modal: false,
      fileID: '',
      modalTitle: '',
      fileOwner: '',
      fileCreated: '',
      username: ''
    };

    this.detail = this.detail.bind(this)
    this.delete = this.delete.bind(this)
    this.upload = this.upload.bind(this)

    window.onscroll = () => {
      this.loadMore()
    }
  }

  componentDidMount() {
    this.findAllFiles();
  }

  findAllFiles() {

    const that = this;
    const userInfo = getUserInfo()

    that.setState({ username: userInfo.Username }, function () {

      axios.get(`${FILES_URL}/query?username=${this.state.username}&page=1`).then(function (res) {
        that.setState({ files: res.data, page: 1 })
      }).catch(function (error) {
        console.log(error)
      });

    })
  }

  loadMore() {
    const that = this
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;

    if (scrolled === 100) {

      axios.get(`${FILES_URL}/query?username=${this.state.username}&page=${this.state.page + 1}`).then(function (res) {

        if (res.data.length > 0) {

          let page = that.state.page + 1
          let files = that.state.files.concat(res.data)

          that.setState({ files: files, page: page })
        }

      }).catch(function (error) {
        console.log(error)
      });
    }
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

  delete(fileID) {

    const yes = window.confirm("Delete ?");
    if (yes === true) {
      const that = this;
      axios.delete(`${FILES_URL}/${fileID}`).then(function (response) {
        that.findAllFiles()
        that.setState(prevState => ({
          modal: !prevState.modal
        }))
        validationSuccess('File has been deleted')
      }).catch(function (error) {
        console.log(error)
        that.setState({ showProgressBar: false })
      });
    }
  }

  upload(files) {

    let that = this;

    // TODO: Implement chunking upload as well as a cancel function        
    // let blob = files[0]
    // let BYTES_PER_CHUNK = parseInt(1048576, 10);
    // let SIZE = blob.size;
    // let NUM_CHUNKS = Math.max(Math.ceil(SIZE / BYTES_PER_CHUNK), 1);
    // let start = 0;
    // let end = BYTES_PER_CHUNK;

    const config = {

      headers: {
        'Content-Type': `multipart/form-data`,
      },

      onUploadProgress: function (progressEvent) {
        const uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total), 10);
        that.setState({ progressBarStyle: { width: `${uploadPercentage}%` }, progressBarValue: uploadPercentage, showProgressBar: true });
      }
    }

    for (let file of files) {

      if (file.size > MAX_FILE_SIZE_IN_BYTES) {

        validationError('Maximum file size 16MB')

      } else if (file.type) {

        let formdata = new FormData();
        formdata.append('file', file, file.name);

        axios.post(`${FILES_URL}/upload`, formdata, config).then(function (response) {

          that.setState({ showProgressBar: false })
          validationSuccess('File has been successfully uploaded.')
          that.findAllFiles()

        }).catch(function (error) {

          that.setState({ showProgressBar: false })
        });

      } else {

        validationError('Invalid file type')

      }
    }

    // while (start < SIZE) {

    //     formdata.append('file', blob.slice(start, end));
    //     formdata.append('name', blob.name);

    //     start = end;
    //     end = start + BYTES_PER_CHUNK;

    //     post('', formdata, config).then(function (response) {

    //         

    //     }).catch(function (error) {
    //         
    //         that.setState({ showProgressBar: false })
    //     });
    // }
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

        { files.length > 0 ?
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

            </div>

          </main>

          : 

          <div className="my-3 p-3 bg-white rounded shadow-sm">
            
            <i className="fas fa-archive"></i> There are no files or folders in this view

          </div>
        }

      </div>
    );
  }
}

export default Dashboard;
