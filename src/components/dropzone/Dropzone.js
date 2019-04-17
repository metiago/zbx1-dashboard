import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { post } from 'axios';
import { getIdToken } from '../../utils/AuthService'

import './Dropzone.css'
import Alert from '../alert/Alert'
import ProgressBar from '../progress/ProgressBar'

class Dropzone extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hightlight: false,
            progressBarStyle: null,
            progressBarValue: 0,
            showProgressBar: false
        };
        this.fileInputRef = React.createRef();

        this.openFileDialog = this.openFileDialog.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    openFileDialog() {
        if (this.props.disabled) return;
        this.fileInputRef.current.click();
    }

    onFilesAdded(evt) {
        if (this.props.disabled) return;
        const files = evt.target.files;
        if (this.props.onFilesAdded) {
            const array = this.fileListToArray(files);
            this.props.onFilesAdded(array);
        }
        this.upload(files);
    }

    fileListToArray(list) {
        const array = [];
        for (var i = 0; i < list.length; i++) {
            array.push(list.item(i));
        }
        return array;
    }

    onDragLeave() {
        this.setState({ hightlight: false });
    }

    onDragOver(evt) {
        evt.preventDefault();
        if (this.props.disabled) return;
        this.setState({ hightlight: true });
    }

    onDrop(event) {
        event.preventDefault();
        if (this.props.disabled) return;
        const files = event.dataTransfer.files;
        if (this.props.onFilesAdded) {
            const array = this.fileListToArray(files);
            this.props.onFilesAdded(array);
        }
        this.setState({ hightlight: false });
        this.upload(files);
    }

    upload(files) {

        // FIXME: CHUNK IT
        // const chunksQueue = new Array(files).fill().map((_, index) => index).reverse();
        // const chunkSize = chunksQueue.length;
        // const chunkId = chunksQueue.pop();
        // const begin = chunkId * chunkSize;
        // const chunk = files[0].slice(begin, begin + chunkSize);
        // console.log(chunk)

        let that = this;

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': getIdToken()
            },
            onUploadProgress: function (progressEvent) {
                const uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                
                let i = 0;
                setInterval(function () {                    
                    if (i == 100) {
                        that.setState({showProgressBar: false})
                    } else {
                        that.setState({progressBarStyle: { width: `${i++}%` }, progressBarValue:  i++, showProgressBar: true});
                    }
                }, 600)

            }
        }        

        let formdata = new FormData();
        for (let file of files) {
            formdata.append('file', file);
        }

        const res = post('http://localhost:5000/api/v1/files/upload', formdata, config);

        
        res.then(function (response) {
            that.handleHttpResponse(response)
        }).catch(function (error) {
            that.handleHttpResponse(error.response)
        });
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
            case 500:
                clazz = 'alert alert-danger'
                status = response.status
                message = response.statusText
                break;
        }

        // FIXME Change it like progress bar updating state
        ReactDOM.render(
            <Alert clazz={clazz} status={status} message={message} />,
            document.getElementById('errors')
        );
    }

    render() {

        return (

            <div>

                <div id="errors" />

                <div className={`Dropzone ${this.state.hightlight ? 'Highlight' : ''}`}
                    onDragOver={this.onDragOver}
                    onDragLeave={this.onDragLeave}
                    onDrop={this.onDrop}
                    onClick={this.openFileDialog}
                    style={{ cursor: this.props.disabled ? 'default' : 'pointer' }}>

                    <input
                        ref={this.fileInputRef}
                        className="FileInput"
                        type="file"
                        multiple
                        onChange={this.onFilesAdded} />

                    <img alt="upload"
                        className="Icon"
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE5LjM1IDEwLjA0QzE4LjY3IDYuNTkgMTUuNjQgNCAxMiA0IDkuMTEgNCA2LjYgNS42NCA1LjM1IDguMDQgMi4zNCA4LjM2IDAgMTAuOTEgMCAxNGMwIDMuMzEgMi42OSA2IDYgNmgxM2MyLjc2IDAgNS0yLjI0IDUtNSAwLTIuNjQtMi4wNS00Ljc4LTQuNjUtNC45NnpNMTQgMTN2NGgtNHYtNEg3bDUtNSA1IDVoLTN6Ii8+PC9zdmc+" />
                    <span>Upload Files</span>

                </div>

                {
                
                (this.state.showProgressBar) ? <ProgressBar style={this.state.progressBarStyle} value={this.state.progressBarValue} /> : ''

                }

            </div>
        );
    }
}

export default Dropzone;