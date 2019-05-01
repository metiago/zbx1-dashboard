// import {} from 'dotenv/config'
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Router, Route, browserHistory } from 'react-router';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Password from './pages/Password'
import Callback from './pages/Callback';

import { requireAuth } from './utils/AuthService';

import App from './App'

const Root = () => {
  return (
    <div className="container">     
      <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="/dashboard" component={Dashboard} onEnter={requireAuth} />
        <Route path="/profile" component={Profile} onEnter={requireAuth} />
        <Route path="/password" component={Password} onEnter={requireAuth} />        
        <Route path="/callback" component={Callback} />
      </Router>
    </div>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();