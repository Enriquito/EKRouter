import React from 'react';
import { BrowserRouter as Router, Route  } from 'react-router-dom';
import './App.css';
//import logo from './logo.svg';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Collections from './Components/Collections';
import Pages from './Components/Pages';
import EditPage from './Components/EditPage';
import NewPage from './Components/NewPage';
import Blocks from './Components/Blocks';
import NewBlock from './Components/NewBlock';
import EditBlock from './Components/EditBlock';

function App() {
  return(
    <Router>
      <Route exact path="/" component={Login} />
      <Route exact path="/dashboard" component={Dashboard} />  
      <Route exact path="/collections" component={Collections} />
      <Route exact path="/pages" component={Pages} />
      <Route exact path="/blocks" component={Blocks} />
      <Route exact path="/block/:id" component={EditBlock} />
      <Route exact path="/new/block" component={NewBlock} />
      <Route path="/page/:id" component={EditPage} />
      <Route exact path="/new/page" component={NewPage} />
    </Router>
  );
}

export default App;