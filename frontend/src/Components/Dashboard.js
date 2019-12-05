import React from 'react';
import Globals from '../Globals.js';

class Dashboard extends React.Component {
    constructor(props){
        super(props);

        this.state = {
          data: null,
        };
    }

    componentDidMount(){
        let isLogedIn = false;

        fetch("http://localhost/api/authenticate-check")
        .then(function(resp){
            console.log(resp);
        })

        if(Globals.isLogedIn)
        {
            //alert('logedin');
        }
        else
        {
           // alert('Not logedin');
        }
    }

    render() {
      return (
        <main class="flex">
            <nav>
                <ul>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/collections">Collections</a></li>
                    <li><a href="/users">Users</a></li>
                    <li><a href="/settings">Settings</a></li>
                    <li><a href="/logout">Logout</a></li>
                </ul>
            </nav>

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