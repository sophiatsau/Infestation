import React from 'react';
import { NavLink } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';

import * as sessionActions from "../../store/session";
import ProfileButton from './ProfileButton';
import './Navigation.css';
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";

export default function Navigation({isLoaded}) {
    const sessionUser = useSelector(state => state.session.user);
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
          </li>
        );
    } else {
        sessionLinks = (
          <li>
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
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
