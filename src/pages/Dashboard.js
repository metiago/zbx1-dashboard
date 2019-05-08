import React, { Component } from 'react';

import axios from 'axios';
import Loader from 'react-loader-spinner'

import { FILES_URL } from "../utils/Request";
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
      filesInProgress: [],
      isUploading: false,
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
    this.cancel = this.cancel.bind(this)
    this.download = this.download.bind(this)
  }

  componentDidMount() {
    window.onscroll = () => {
      this.loadMore()
    }
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

    if (scrolled > 98) {

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

  detail(file) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      fileID: file.id,
      modalTitle: file.name,
      fileOwner: file.username,
      fileCreated: file.created
    }));
  }

  delete(fileID) {

    const yes = window.confirm("Delete ?");
    if (yes === true) {
      const that = this;
      that.setState(prevState => ({modal: !prevState.modal}))
      axios.delete(`${FILES_URL}/${fileID}`).then(function (response) {
        that.findAllFiles()        
        validationSuccess('File has been deleted')
      }).catch(function (error) {
        console.log(error)
      });
    }
  }

  upload(files) {

    for (let file of files) {

      if (file.type) {

        let CancelToken = axios.CancelToken;
        let source = CancelToken.source();

        let config = {

          headers: {
            'Content-Type': `multipart/form-data`,
          },
          cancelToken: source.token,
          onUploadProgress: function (progressEvent) {
            //const uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total), 10);
            //const elem = document.getElementById("progress")
            //ReactDOM.render(<ProgressBar source={source} style={{ width: `${uploadPercentage}%` }} value={uploadPercentage} files={that.state.filesInProgress} />, elem)
            //if (uploadPercentage === 100) { }
          }
        }

        let obj = {
          file: file,
          source: source
        }

        this.state.filesInProgress.push(obj)
        this.setState({ isUploading: true }, () => this.send(config, file))
      }
      else if (file.size > MAX_FILE_SIZE_IN_BYTES) {
        validationError('Maximum file size 16MB')
      }
      else {
        validationError('Invalid file type')
      }
    }
  }

  send(config, file) {
    const that = this
    let formdata = new FormData();
    formdata.append('file', file, file.name);

    axios.post(`${FILES_URL}/upload`, formdata, config).then(function (response) {

      that.removeFile(file.name)
      validationSuccess('File has been successfully uploaded.')
      that.findAllFiles()

    }).catch(function (error) {
      that.removeFile(file.name)
    });
  }

  removeFile(name) {
    const newState = this.state;
    const index = newState.filesInProgress.findIndex(a => a.file.name === name);

    if (index === -1) return;

    newState.filesInProgress.splice(index, 1);
    this.setState(newState);
  }

  cancel(source, name) {
    this.removeFile(name)
    source.cancel({ files: this.state.filesInProgress });
  }

  download(file) {

    const config = {
      responseType: 'blob',
    }

    axios.get(`${FILES_URL}/download/${file.id}`, config).then(function (response) {

      var a = document.createElement('a');
      a.style = "display: none";
      var blob = new Blob([response.data], { type: "application/octet-stream" });
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);

    }).catch(function (error) {
      console.log(error)
    });

  }

  render() {

    let that = this;
    const { files } = that.state;

    return (

      <div>

        <FileDetail modal={this.state.modal} fileID={this.state.fileID} title={this.state.modalTitle} username={this.state.fileOwner} created={this.state.fileCreated} detail={this.detail} delete={this.delete} />

        <Nav />

        <Dropzone upload={this.upload} />

        {
          that.state.filesInProgress.map(function (f, i) {
            return (
              <div key={i}>
                <hr />
                <div>
                  {
                    that.state.isUploading
                  }
                  <div className="container">
                    <div className="row">
                      <div className="col-sm">
                        {f.file.name}
                      </div>
                      <div className="col-sm">
                        <Loader type="ThreeDots" color="#000000" height="30" width="30" />
                      </div>
                      <div className="col-sm">
                        <button className="btn btn-danger btn-sm" onClick={() => that.cancel(f.source, f.file.name)}> Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }

        {files.length > 0 ?

          <main>

            <div id="loader" />

            <div className="my-3 p-3 bg-white rounded shadow-sm">
              <h6 className="border-bottom border-gray pb-2 mb-0">My Files</h6>
              {files.map((data, index) => (
                <div className="media text-muted pt-3" key={index}>
                  <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff" /><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
                  <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <a onClick={() => this.detail(data)}><strong className="zb-file-name ">{data.name}</strong></a>
                      <a onClick={() => this.download(data)}>Download</a>
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
