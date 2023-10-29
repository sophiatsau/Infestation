import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import GroupsThumbnail from './GroupsThumbnail'
import { fetchGroups, consumeAllGroups } from '../../store/groups';

import './GroupsList.css';
import FeaturesNav from '../FeaturesNav';

export default function GroupsList() {
    window.scroll(0,0);
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
    <FeaturesNav />
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
