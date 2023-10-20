import React from 'react';
import { NavLink } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';

import * as sessionActions from "../../store/session";
import ProfileButton from './ProfileButton';
import './Navigation.css';

export default function Navigation({isLoaded}) {
    const sessionUser = useSelector(state => state.session.user);
    console.log("🚀 ~ file: index.js:11 ~ Navigation ~ sessionUser:", sessionUser)
    const dispatch = useDispatch();

    const logout = (e) => {
        e.preventDefault()
        dispatch(sessionActions.logout());
    }

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
          <li>
            <ProfileButton user={sessionUser} />
            <button onClick={logout}>Log Out</button>
          </li>
        );
    } else {
        sessionLinks = (
          <li>
            <NavLink to="/login">Log In</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </li>
        );
    }

    return (
        <ul>
            <li>
                <NavLink exact to='/'>
                    Home
                </NavLink>
            </li>
            {isLoaded && sessionLinks}
        </ul>
    )
}
