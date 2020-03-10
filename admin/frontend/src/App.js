import React from 'react';
import { BrowserRouter as Router, Route  } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Collections from './Components/Collections';
import Items from './Components/Items';
import Collection from './Components/Collection';
import Item from './Components/Item';


function App() {
  return(
      <Router>
        <Route exact path="/" component={Login} />
        <Route exact path="/dashboard" component={Dashboard} />  
        <Route exact path="/collections" component={Collections} />
        <Route exact path="/collection/edit/:name" component={Collection} />
        <Route exact path="/items/:collection" component={Items} />
        <Route exact path="/item/edit/:id" component={Item} />
    </Router>
  );
}

export default App;
