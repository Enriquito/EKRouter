import React from 'react';
import { BrowserRouter as Router, Route  } from 'react-router-dom';
import './App.css';
//import logo from './logo.svg';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Collections from './Components/Collections';
import Pages from './Components/Pages';
import EditPage from './Components/EditPage';


function App() {
  return(
    <Router>
      <Route exact path="/" component={Login} />
      <Route exact path="/dashboard" component={Dashboard} />  
      <Route exact path="/collections" component={Collections} />
      <Route exact path="/pages" component={Pages} />
      <Route exact path="/page/:id" component={EditPage} />
    </Router>
    
  );
}

export default App;
