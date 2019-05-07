import React, { Component } from 'react';


class ProgressBar extends Component {

  constructor(props) {
    super(props)

    this.cancel = this.cancel.bind(this)
  }

  cancel() {
    this.props.source.cancel('Operation canceled by the user.');
  }

  progressBar = () => {

    let arr = []

    for (let i = 0; i < this.props.files.length; i++) {

      arr.push(
        <div id={i} key={i}>
          <div className="progress" />
          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={this.props.style} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{this.props.value}%</div>
          <small> <a onClick={this.cancel}> Cancel</a> </small>
        </div>
      )
    }

    return arr
  }

  render() {

    return (
      <div>
        {this.progressBar()}
      </div>

    )
  }
}
export default ProgressBar;