import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './dashboard/Dashboard';
import Callback from './dashboard/Callback';
import App from './App'
import registerServiceWorker from './registerServiceWorker';
import { Router, Route, browserHistory } from 'react-router';
import { requireAuth } from './utils/AuthService';

const Root = () => {
  return (
    <div className="container">
      <Router history={browserHistory}>
        <Route path="/" component={App}/>
        <Route path="/dashboard" component={Dashboard} onEnter={requireAuth}/>
        <Route path="/callback" component={Callback} />
      </Router>
    </div>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();