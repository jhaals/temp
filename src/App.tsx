import * as React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Create from './Create';

const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

class App extends React.Component {
  public render() {
    return (
      <Router>
        <div>
          <Route path="/" exact={true} component={Create} />
          <Route path="/about/" component={About} />
          <Route path="/users/" component={Users} />
        </div>
      </Router>
    );
  }
}

export default App;
