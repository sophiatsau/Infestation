import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
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
  };

  function openMenu() {
    if (showMenu) return;
    setShowMenu(true);
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

return (
  <>
    <button onClick={openMenu}>
      <i className="fas fa-bug" style={{color:"white"}}/>
    </button>
    <ul className={ulClassName} ref={ulRef}>
      {user ? (
        <>
          <li>{user.username}</li>
          <li>{user.firstName} {user.lastName}</li>
          <li>{user.email}</li>
          <li>
            <button onClick={logout}>Log Out</button>
          </li>
        </>
      ) : (
        <div className="profile-button">
          <li>
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
          </li>
          <li>
            <OpenModalButton
              buttonText="Sign Up"
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
