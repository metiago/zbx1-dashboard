import React from 'react';

const UploadNav = (props) => (

    <div>
        <p key={props.key}> {props.name}: Uploading... </p>
        <small> <a onClick={props.cancel}> Cancel</a> </small>
    </div>
);

export default UploadNav;