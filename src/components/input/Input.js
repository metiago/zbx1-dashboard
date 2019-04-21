import React from 'react';

const Input = (props) => (

    <div>
        <label htmlFor={props.id}> {props.text}</label>
        <input onChange={props.onChange}
            type={props.type}
            className="form-control"
            id={props.id}
            placeholder={props.text}
            value={props.value} />
    </div>
);

export default Input;