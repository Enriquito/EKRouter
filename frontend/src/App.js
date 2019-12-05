import React from 'react';
//import logo from './logo.svg';
import Login from './Components/Login.js';
import Dashboard from './Components/Dashboard.js';
import './App.css';
import Globals from './Globals.js';
import { BrowserRouter as Router, Route  } from 'react-router-dom';

function App() {
  return(
    <Router>
      <Route exact path="/" component={Login} />
      <Route exact path="/dashboard" component={Dashboard} />    
    </Router>
    
  );
}

export default App;
