import React from 'react';
import './topbar.css';

export default function Topbar(data){
    let name = null;

    if(data.user.FirstName !== null || data.user.LastName !== null)
        name = `${data.user.FirstName} ${data.user.LastName}`;
    else
        name = "Unknown";

    let role = null;

    if(data.user.Role.Name !== null)
        role = data.user.Role.Name
    
    return(
        <header className='flex vertical-center'>
            <div className='logo'>
                <strong>Q</strong>
                <span>CMS</span>
            </div>
            <div id='search'>
                {/* <img src='' alt='Search icon' /> */}
                <input type='search' placeholder='Search for.. collections, items...' />
                <div id='search-results'>

                </div>
            </div>
            <div id='user-display' className='flex'>
                <figure className='flex vertical-center'>
                    <img src='https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png' alt='' />
                    <figcaption>
                        <strong>{name}</strong>
                        <span>{role}</span>
                    </figcaption>
                </figure>
            </div>
        </header>
    );
}