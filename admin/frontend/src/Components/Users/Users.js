import React from 'react';
import { hasSession, formatDate } from '../Helpers';
import Navigation from '../Navigation';

class Users extends React.Component {
    constructor(props){
        hasSession(false);
        super(props);
        
        this.state = {
          Users : null
        };
    }

    componentDidMount(){
        this.Load();
    }
    
    Load(){
      fetch(`http://localhost/api/users/list`)
        .then((resp) => resp.json())
        .then((resp) => {
            this.setState({Users : resp});
        })
        .catch((error) => {
            alert("Error could not fetch data.");
        });
    }
    
    render() {
        let users = null;

        if(this.state.Users != null){
            users = this.state.Users.map((el) => {
              const dateCreated = formatDate(el.Created);
              const lastLogin = formatDate(el.LastLogin);
                return(
                    <tr key={el.ID}>
                        <td>{el.Username}</td>
                        <td>{el.Email}</td>
                        <td>{`${dateCreated.day}-${dateCreated.month}-${dateCreated.year}`}</td>
                        <td>{`${lastLogin.day}-${lastLogin.month}-${lastLogin.year} ${lastLogin.hour}:${lastLogin.minutes}`}</td>
                        <td><div className="gg-pen"></div></td>
                    </tr>
                );
            });
        }
         
      return (
        <main className="flex">
          <Navigation item="users" />
          <div id="holder">
            <div className="flex">
              <h1 style={{marginTop: "0px"}}>Users</h1>
              <button onClick={() => {window.location = "/user/new"}} style={{width: "100px", height : "30px", marginLeft : "10px"}} className="theme-green-bg new-collection-button">New</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Created</th>
                        <th>Last Login</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users}
                </tbody>
            </table>
            </div>
        </main>
      );
    }
  }

export default Users;