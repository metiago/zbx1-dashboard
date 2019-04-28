import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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
      filesInProgress: [],
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
    this.download = this.download.bind(this)

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
      axios.delete(`${FILES_URL}/${fileID}`).then(function (response) {
        that.findAllFiles()
        that.setState(prevState => ({
          modal: !prevState.modal
        }))
        validationSuccess('File has been deleted')
      }).catch(function (error) {
        console.log(error)
      });
    }
  }

  showProgressBar(source, uploadPercentage) {
    ReactDOM.render(<ProgressBar source={source} style={{ width: `${uploadPercentage}%` }} value={uploadPercentage} files={this.state.filesInProgress} />, document.getElementById("progress"))
  }

  hideProgressBar() {
    ReactDOM.render('', document.getElementById("progress"))
  }

  send(file) {

    let that = this;
    let CancelToken = axios.CancelToken;
    let source = CancelToken.source();
    let config = {

      headers: {
        'Content-Type': `multipart/form-data`,
      },
      cancelToken: source.token,
      onUploadProgress: function (progressEvent) {

        const uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total), 10);

        that.showProgressBar(source, uploadPercentage)

        if (uploadPercentage === 100) {
          that.setState({
            filesInProgress: []
          });
          that.hideProgressBar()
        }
      }
    }

    let formdata = new FormData();
    formdata.append('file', file, file.name);

    axios.post(`${FILES_URL}/upload`, formdata, config).then(function (response) {

      validationSuccess('File has been successfully uploaded.')
      that.findAllFiles()

    }).catch(function (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      }
      console.log(error)
      that.hideProgressBar()
    });
  }

  upload(files) {

    // TODO: Implement chunking upload as well as a cancel function        
    // let blob = files[0]
    // let BYTES_PER_CHUNK = parseInt(1048576, 10);
    // let SIZE = blob.size;
    // let NUM_CHUNKS = Math.max(Math.ceil(SIZE / BYTES_PER_CHUNK), 1);
    // let start = 0;
    // let end = BYTES_PER_CHUNK;

    for (let file of files) {

      if (file.size > MAX_FILE_SIZE_IN_BYTES) {

        validationError('Maximum file size 16MB')

      } else if (file.type) {

        this.state.filesInProgress.push(file)

        this.send(file)

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

  download(file) {

    axios.get(`${FILES_URL}/download/${file.id}`).then(function (response) {

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();

    }).catch(function (error) {
      console.log(error)
    });

  }

  render() {

    const { files } = this.state;

    return (

      <div>

        <FileDetail modal={this.state.modal} fileID={this.state.fileID} title={this.state.modalTitle} username={this.state.fileOwner} created={this.state.fileCreated} detail={this.detail} delete={this.delete} />

        <Nav />

        <Dropzone upload={this.upload} />

        <div id="progress"></div>

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
