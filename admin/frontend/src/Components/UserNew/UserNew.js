import React from 'react';
import { hasSession } from '../Helpers';
import Navigation from '../Navigation';

class UserNew extends React.Component {
    constructor(props){
        hasSession(false);
        super(props);
        this.Item = [];
        
        this.state = {
            User : null
        };
    }

    Save(e){
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        if(!username.checkValidity(), !email.checkValidity(), !password.checkValidity())
            return;

        fetch('http://localhost/api/user', {
            method : "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                user : {
                    username : username.value,
                    email : email.value,
                    password : password.value
                }
            }
            )
        })
        .then(function(data){
            if(data.status === 201)
            window.location = `/users`
            else
            alert("Error while creating user");
        })
        .catch(function(error){
        alert(error);
        });

        e.preventDefault();
    }
    
    render() {  
        
      return (
        <main className="flex">
          <Navigation item="users" />
            <div id="holder">
                <h1 style={{marginTop: "0px"}}>New User</h1>
                <form>
                    <label for='username'>Username</label>
                    <br />
                    <input style={{'width' :'500px'}} id='username' type='text' placeholder='New username' required={true} />
                    <br />
                    <label for='email'>Email</label>
                    <br />
                    <input style={{'width' :'500px'}} id='email' type='email' placeholder='email@example.com' required={true} />
                    <br />
                    <label for='password'>Password</label>
                    <br />
                    <input style={{'width' :'500px'}} minLength='8' id='password' type='password' placeholder='Password' required={true} />
                
                    <div className="flex">
                        <button 
                        style={{width: "75px", height : "30px", padding : "0"}} 
                        className="theme-green-bg new-collection-button"
                        onClick={(e) => {
                            this.Save(e);
                        }}
                        >Save</button>
                        <button 
                        style={{marginLeft : "0px", width: "75px", height : "30px", padding : "0"}} 
                        className="theme-blue-bg new-collection-button"
                        onClick={this.props.history.goBack}
                        >Cancel</button>
                    </div>
                </form>
            </div>
        </main>
      );
    }
  }

export default UserNew;