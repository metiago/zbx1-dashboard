import React from 'react';

const Signup = (props) => (

    <form>
        <div className="form-row">
            <div className="form-group col-md-6">
                <label htmlFor="inputUsername">Username</label>
                <input onChange={props.onChangeUsername} type="text" className="form-control" id="inputUsername" placeholder="Username" value={props.username}/>
            </div>
            <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Password</label>
                <input onChange={props.onChangePassword} type="password" className="form-control" id="inputPassword4" placeholder="Password" />
            </div>
        </div>
        <div className="form-group">
            <label htmlFor="inputName">Name</label>
            <input onChange={props.onChangeName} type="text" className="form-control" id="inputName" placeholder="Name" value={props.name}/>
        </div>
        <div className="form-group">
            <label htmlFor="inputEmail">Email</label>
            <input onChange={props.onChangeEmail} type="email" className="form-control" id="inputEmail" placeholder="Email" value={props.email}/>
            <small className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <button onClick={props.signup} type="button" className="btn btn-primary">Send</button>
    </form>
);

export default Signup;