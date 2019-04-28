import React, { Component } from 'react';


class ProgressBar extends Component {

  progressBar = () => {

    let arr = []

    for (let i = 0; i < this.props.files.length; i++) {

      arr.push(
        <div key={i}>
          <div className="progress" />
          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={this.props.style} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{this.props.value}%</div>
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