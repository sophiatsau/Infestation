import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';

import LoginFormModal from "../LoginFormModal";
import SignupFormModal from '../SignupFormModal';
import OpenModalButton from '../OpenModalButton';

//only shows if current user present
function ProfileButton({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  //holds mutable ref object with .current initialized to undefined. .current is mutable, is set to corresponding DOM node
  //mutating .current doesn't cause re-render
  const ulRef = useRef();
  const history = useHistory();

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
        //ulRef.current points to dropdown menu element
        //contains - boolean, is e.target in element?
        if (ulRef.current.contains(e.target)) return;

        setShowMenu(false);
    }

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu)
  }, [showMenu])


  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowMenu(false);
    history.push('/');
  };

  function openMenu() {
    if (showMenu) return;
    setShowMenu(true);
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

return (
  <>
    <button onClick={openMenu} className="profile-button">
      <i className="fas fa-bug" style={{color:"white"}}/>
    </button>
    <ul className={ulClassName} ref={ulRef}>
      <button className="light-button" onClick={() => history.push('/groups')}>View groups</button>
      <button className="light-button" onClick={() => history.push('/events')}>View events</button>
      {user ? (
        <>
          <li className="dropdown-profile-top">Hello, {user.firstName}</li>
          <li>{user.email}</li>
          <li>
            <button onClick={logout}>Log Out</button>
          </li>
        </>
      ) : (
        <div>
          <li>
            <OpenModalButton
              buttonText="Log In"
              className="light-button"
              modalComponent={<LoginFormModal />}
            />
          </li>
          <li>
            <OpenModalButton
              buttonText="Sign Up"
              className="light-button"
              modalComponent={<SignupFormModal />}
            />
          </li>
        </div>
        )}
      </ul>
    </>
  );
}

/*
alt icons:
user: "fas fa-user-circle"
spider: "fas fa-spider"
bug: "fas fa-bug"
*/

export default ProfileButton;
