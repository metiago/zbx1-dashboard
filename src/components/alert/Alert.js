import React from 'react';

const AlertDanger = (props) => (

    <div className={props.clazz} role="alert">
        Status: {props.status}: {props.message}
    </div>

);

export default AlertDanger;