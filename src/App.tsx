import * as React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Navbar, NavbarBrand } from 'reactstrap';

import './App.css';
import Create from './Create';

class App extends React.Component {
  public render() {
    return (
      <Router>
        <div>
          <div className="App">
            <Navbar color="dark" dark={true} expand="md">
              <NavbarBrand href="/">Yopass</NavbarBrand>
            </Navbar>
          </div>

          <div>
            <Route path="/" exact={true} component={Create} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
