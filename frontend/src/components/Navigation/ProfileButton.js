import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

//only shows if current user present
function ProfileButton({ user }) {
  console.log("🚀 ~ file: ProfileButton.js:7 ~ ProfileButton ~ user:", user)
  const dispatch = useDispatch();


  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

//   const ulClassName = "profile-dropdown";

  return (
    <>
      <button>
        <i className="fas fa-bug" />
      </button>
      <ul className="profile-dropdown">
        <li>{user.username}</li>
        <li>{user.firstName} {user.lastName}</li>
        <li>{user.email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
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
