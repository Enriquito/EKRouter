import React from 'react';
import { BrowserRouter as Router, Route  } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Collections from './Components/Collections';
import Navigation from './Components/Navigation';

function App() {
  return(
    <main className="flex">
      <Navigation />
      <Router>
      <Route exact path="/" component={Login} />
      <Route exact path="/dashboard" component={Dashboard} />  
      <Route exact path="/collections" component={Collections} />
    </Router>
    </main>
  );
}

export default App;
