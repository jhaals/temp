import * as React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Create from './Create';

class App extends React.Component {
  public render() {
    return (
      <Router>
        <div>
          <Route path="/" exact={true} component={Create} />
        </div>
      </Router>
    );
  }
}

export default App;
