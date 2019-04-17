import React from 'react';

const ProgressBar = (props) => (

  <div>

    <div className="progress" />
    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={props.style} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{props.value}%</div>
   
  </div>

);

export default ProgressBar;