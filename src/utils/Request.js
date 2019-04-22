import React from 'react';
import ReactDOM from 'react-dom'

import axios from 'axios';

import Loader from 'react-loader-spinner'
import { getToken } from './AuthService'
import Alert from '../components/alert/Alert'

axios.interceptors.request.use(async (config) => {

  config.headers.Authorization = getToken()

  ReactDOM.render(<Loader type="Oval" color="#FFFFFF" height="30" width="30" />, document.getElementById('loader'))

  return config;

}, (error) => {

  console.log(error)

  handleHttpResponse(error.response)

  return Promise.reject(error);

});

axios.interceptors.response.use(function (response) {

  ReactDOM.render(<div></div>, document.getElementById('loader'))

  handleHttpResponse(response)

  return response;

}, function (error) {
  
  handleHttpResponse(error.response)

  return Promise.reject(error);

});

export function handleHttpResponse(response) {

  let clazz = null;
  let status = null;
  let message = null;

  switch (response.status) {
    case 200:
    case 201:
      return
    case 403:
      clazz = 'alert alert-warning'
      status = response.status
      message = response.statusText
      break;
    case 400:
      clazz = 'alert alert-warning'
      status = response.status
      message = response.data.message
      break;
    case 500:
      clazz = 'alert alert-danger'
      status = response.status
      message = response.statusText
      break;
    case 204:
      return
    default:
      console.log(response)
      return
  }

  ReactDOM.render(<Alert clazz={clazz} status={status} message={message} />, document.getElementById('alert'));
}

export function validationError(message) {
  const elem = <div className="alert alert-danger" role="alert"> {message} </div>;
  ReactDOM.render(elem, document.getElementById('alert'));
}

export function validationSuccess(message) {
  const elem = <div className="alert alert-success" role="alert"> {message} </div>;
  ReactDOM.render(elem, document.getElementById('alert'));
}