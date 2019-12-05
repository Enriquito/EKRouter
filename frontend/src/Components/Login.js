import React from 'react';
import Globals from '../Globals.js';
import '../css/login.css'

class Login extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            type : "",
            messages : ""
        };
    }

    login(){
        console.log(document.getElementById('password').value);
        fetch('http://localhost/api/login', {
            method : "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'mode' : 'no-cors'
            },
            body: JSON.stringify({
                email: document.getElementById('username').value,
                password: document.getElementById('password').value,
            })
        })
        .then((resp) => resp.json())
        .then(function(data){
            console.log(data);
            if(data.Code === 1001){
                window.location = "/dashboard";
            }
            else{
                document.getElementById('password').value = "";
                this.setState(
                    {
                        type : "error-messages",
                        messages : "Your password or email is incorrect."
                    }.bind(this));
            }
        })
        .catch(function(error){
            this.setState(
                {
                    type : "error-messages",
                    messages : "Something went wrong..."
                });
        }.bind(this));
          
    }

    render() {
        console.log(this.state.messages);
      return (
            <main className="flex center">
                <div className="flex center">
                    <div id="form-holder">
                        <h1>Log into <strong>Q</strong></h1>
                        <input type="email" id="username" placeholder="Example@domain.com" />
                        <input type="password" id="password" placeholder="Password" />
                        <strong className={"login-" + this.state.type}>{this.state.messages}</strong>
                        <button onClick={this.login.bind(this)} >Login</button>
                        <p>
                            <a href="/recover">I forgot my <strong>Username</strong> or <strong>Password</strong></a>
                        </p>
                    </div> 
                </div>
            </main>
      );
    }
  }

export default Login;