import React, { Component } from 'react';

class Alert extends Component {

    showAlert = () => {

        let msgErrs = []

        if (typeof (this.props.messages) === 'string') {
            
            msgErrs.push(this.props.messages)
        } 
        else {

            for (let i = 0; i <= this.props.messages.length; i++) {
                msgErrs.push(this.props.messages[i])
                msgErrs.push(<br key={i}></br>)
            }
        }

        return msgErrs
    }

    render() {
        return (
            <div className={this.props.clazz} role="alert">
                {this.showAlert()}
            </div>
        )
    }
}
export default Alert;