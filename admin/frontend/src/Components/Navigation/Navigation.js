import React from 'react';
import './navigation.css';
import { logout } from '../Helpers';

function Navigation(activeTab){
    let dashboard = <li><a href="/dashboard">Dashboard</a></li>;
    let collections = <li><a href="/collections">Collections</a></li>;
    let users = <li><a href="/users">Users</a></li>;
    let settings = <li><a href="/settings">Settings</a></li>;

    switch(activeTab.item)
    {
        case "dashboard":
            dashboard = <li><a style={{"color" : "#1abc9c"}} href="/dashboard">Dashboard</a></li>
        break;
        case "collections":
            collections = <li><a style={{"color" : "#1abc9c"}} href="/collections">Collections</a></li>
            break;
        case "users":
            users = <li><a style={{"color" : "#1abc9c"}} href="/users">Users</a></li>
            break;
        case "settings":
            settings = <li><a style={{"color" : "#1abc9c"}} href="/settings">Settings</a></li>
            break;
        default:
            
        break;
    }

    return(
        <nav>
            <ul>
                {dashboard}
                {collections}
                {users}
                {settings}
                <li><a onClick={logout} href="#">Logout</a></li>
            </ul>
        </nav>
    );
}

export default Navigation;