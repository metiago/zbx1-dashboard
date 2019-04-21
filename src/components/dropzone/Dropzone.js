import React, { Component } from 'react'

import './Dropzone.css'

class Dropzone extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hightlight: false
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
        this.props.upload(files);
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
        const files = event.dataTransfer.files
        if (this.props.onFilesAdded) {
            const array = this.fileListToArray(files);
            this.props.onFilesAdded(array);
        }
        this.setState({ hightlight: false });

        // calling parent function
        this.props.upload(files);

        // if (event.dataTransfer.types) {
        //     for (var i = 0; i < event.dataTransfer.types.length; i++) {
        //         if (event.dataTransfer.types == "Files") {
        //             console.log('***')
        //             console.log(files[i])
        //         } else {
        //             console.log('folder')
        //         }
        //     }
        // }
    }
    
    // TODO Change it to reactive component
    render() {

        return (

            <div>
                
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

            </div>
        );
    }
}

export default Dropzone;