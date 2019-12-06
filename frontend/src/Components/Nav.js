import React from 'react';
import { logout } from './Helpers';

function Nav(){
    return(
        <nav>
            <ul>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/collections">Collections</a></li>
                <li><a href="/pages">Pages</a></li>
                <li><a href="/users">Users</a></li>
                <li><a href="/settings">Settings</a></li>
                <li><a onClick={logout} href="#">Logout</a></li>
            </ul>
        </nav>
    );
}

export default Nav;