import React from 'react';
import { hasSession } from '../Helpers';

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
        <div></div>
      );
    }
  }

export default Dashboard;