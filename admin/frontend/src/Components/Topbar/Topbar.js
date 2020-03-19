import React from 'react';
import './topbar.css';

export default function Topbar(){
    return(
        <header className='flex vertical-center'>
            <div className='logo'>
                <strong>Q</strong>
                <span>CMS</span>
            </div>
            <div className='user-display'>
                <figure>
                    <img src='' alt='username' />
                    <figcaption>

                    </figcaption>
                </figure>
            </div>
        </header>
    );
}