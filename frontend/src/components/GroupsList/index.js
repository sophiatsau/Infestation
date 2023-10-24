import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min'
import { useDispatch, useSelector } from 'react-redux'

import GroupsThumbnail from './GroupsThumbnail'
import { fetchGroups, consumeAllGroups } from '../../store/groups';

import './GroupsList.css';

export default function GroupsList() {
    //get all groups
    //iterate over all groups
    const dispatch = useDispatch();
    const groups = useSelector(consumeAllGroups());

    let Groups=[];
    useEffect(() => {
        const getGroups = async () => {
            const data = await dispatch(fetchGroups());
            Groups = data.Groups;
        };
        getGroups();
    }, [dispatch])

  return (
    <>
    <div className="feature-nav-container">
        <NavLink className="feature-header" to='/events'>Events</NavLink>
        <NavLink className="feature-header" to='/groups'>Groups</NavLink>
    </div>
    <p className="feature-caption">Groups in Infestation</p>
    <ul className="groups-list">
        {groups.map((group) => {
            if (!group.id) return null;
            return (
                <li key={group.id}>
                    <GroupsThumbnail group={group}/>
                </li>
            )
        })}
    </ul>
    </>
  )
}
