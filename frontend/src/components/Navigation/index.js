import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {useSelector} from 'react-redux';

import ProfileButton from './ProfileButton';
import './Navigation.css';

export default function Navigation({isLoaded}) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <ul className='nav'>
            <li>
                <NavLink exact to='/'>
                    <img src="./images/logo.png" alt="infestation logo"/>
                </NavLink>
            </li>
            {isLoaded && (
            <>
            {sessionUser && (
                <li>
                    <Link to='/groups/new'>Start a new group</Link>
                </li>
            )}
            <li>
              <ProfileButton user={sessionUser} />
            </li>
            </>
            )}
        </ul>
    )
}
