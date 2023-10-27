import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {useSelector} from 'react-redux';

import ProfileButton from './ProfileButton';
import './Navigation.css';
import { csrfFetch } from '../../store/csrf';

export default function Navigation({isLoaded}) {
    const sessionUser = useSelector(state => state.session.user);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        async function getImage() {
            const img = await csrfFetch('/images/logo.jpg')
            setImageUrl(img.url);
        }
        getImage()
    }, [])

    return (
        <ul className='nav'>
            <li>
                <NavLink exact to='/'>
                    <img className="infestation-logo" src={imageUrl} alt="infestation logo"/>
                </NavLink>
            </li>
            {isLoaded && (
            <li>
                {sessionUser && (
                    <Link to='/groups/new' className="new-group-link">Start a new group</Link>
                )}
              <ProfileButton user={sessionUser} />
            </li>
            )}
        </ul>
    )
}
