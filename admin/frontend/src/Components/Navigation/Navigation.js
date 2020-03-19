import React from 'react';
import './navigation.css';
import { logout } from '../Helpers';
import dashboardIcon from '../../icons/dashboard.svg';
import exitIcon from '../../icons/exit.svg';
import settingsIcon from '../../icons/settings.svg';
import usersIcon from '../../icons/people.svg';
import collectionItem from '../../icons/apps-alt.svg';

function Navigation(activeTab){
    let dashboard = <a href="/dashboard">Dashboard</a>;
    let collections = <a href="/collections">Collections</a>;
    let users = <a href="/users">Users</a>;
    let settings = <a href="/settings">Settings</a>;

    switch(activeTab.item)
    {
        case "dashboard":
            dashboard = <a style={{"color" : "#1abc9c"}} href="/dashboard">Dashboard</a>;
        break;
        case "collections":
            collections = <a style={{"color" : "#1abc9c"}} href="/collections">Collections</a>;
            break;
        case "users":
            users = <a style={{"color" : "#1abc9c"}} href="/users">Users</a>;
            break;
        case "settings":
            settings = <a style={{"color" : "#1abc9c"}} href="/settings">Settings</a>;
            break;
        default:
            
        break;
    }

    return(
        <nav>
            <ul>
                <li className='flex vertical-center'><img src={collectionItem} alt='Dashboard' />{dashboard}</li>
                <li className='flex vertical-center'><img src={dashboardIcon} alt='Collections' />{collections}</li>
                <li className='flex vertical-center'><img src={usersIcon} alt='Users' />{users}</li>
                <li className='flex vertical-center'><img src={settingsIcon} alt='Settings' />{settings}</li>
                <li onClick={logout} className='flex vertical-center'><img src={exitIcon} alt='Settings' />Logout</li>
            </ul>
        </nav>
    );
}

export default Navigation;