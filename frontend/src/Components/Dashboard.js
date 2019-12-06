import React from 'react';
import { hasSession } from './Helpers';
import Nav from './Nav';

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
        <main class="flex">
          <Nav />
            <section>
                <h1>Dashboard</h1>
                <div class="flex">
                    
                </div>
            </section>
        </main>
      );
    }
  }

export default Dashboard;