import React from 'react';
//import logo from './logo.svg';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Collections from './Components/Collections';
import './App.css';
import Globals from './Globals.js';
import { BrowserRouter as Router, Route  } from 'react-router-dom';

function App() {
  return(
    <Router>
      <Route exact path="/" component={Login} />
      <Route exact path="/dashboard" component={Dashboard} />  
      <Route exact path="/collections" component={Collections} />    
    </Router>
    
  );
}

export default App;
