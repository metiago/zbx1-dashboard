import React from 'react';

const Button = (props) => (

    <button disabled={props.disabled} onClick={props.signup} type="button" className={props.clazz}>{props.text}</button>
);

export default Button;