import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { post } from 'axios';

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
        let that = this;
        let blob = files[0]
        let BYTES_PER_CHUNK = parseInt(1048576, 10);
        let SIZE = blob.size;
        let NUM_CHUNKS = Math.max(Math.ceil(SIZE / BYTES_PER_CHUNK), 1);
        let start = 0;
        let end = BYTES_PER_CHUNK;
        let formdata = new FormData();

        const config = {

            onUploadProgress: function (progressEvent) {

                const uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));

                that.setState({ progressBarStyle: { width: `${uploadPercentage}%` }, progressBarValue: uploadPercentage, showProgressBar: true });
            }
        }


        // for (let file of files) {
        //     formdata.append('file', file);
        // }

        while (start < SIZE) {
            formdata.append('file', blob.slice(start, end));
            console.log(blob.slice(start, end))
            start = end;
            end = start + BYTES_PER_CHUNK;

            for (let file of files) {
                formdata.append('file', file);
            }

            post('http://localhost:5000/api/v1/files/upload', formdata, config).then(function (response) {

                that.handleHttpResponse(response)

            }).catch(function (error) {
                that.handleHttpResponse(error.response)
                that.setState({ showProgressBar: false })
            });
        }
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