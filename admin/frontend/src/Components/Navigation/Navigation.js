import React from 'react';
import './navigation.css';
import { logout } from '../Helpers';

function Navigation(){
    return(
        <nav>
            <ul>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/collections">Collections</a></li>
                <li><a href="/users">Users</a></li>
                <li><a href="/settings">Settings</a></li>
                <li><a onClick={logout} href="#">Logout</a></li>
            </ul>
        </nav>
    );
}

export default Navigation;