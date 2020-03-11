import React from 'react';
import { hasSession } from '../Helpers';
import Navigation from '../Navigation';

class Dashboard extends React.Component {
    constructor(props){
        hasSession();
        super(props);

        this.state = {
          data: null,
        };
    }
    
    render() {
      return (
        <main className="flex">
          <Navigation item="dashboard"/>
        </main>
      );
    }
  }

export default Dashboard;