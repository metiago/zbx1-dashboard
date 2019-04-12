import { Component } from 'react';
import { setIdToken, setAccessToken } from '../utils/Auth0Service';

class Callback extends Component {

  componentDidMount() {
    setAccessToken();
    setIdToken();
    window.location.href = "/dashboard";
  }

  render() {
    return null;
  }
}

export default Callback;
