import React, { useEffect, useState } from 'react';
import {useParams, Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {fetchGroupById, consumeOneGroup} from '../../store/groups';

import GroupEvents from './GroupEvents';

import './GroupDetails.css';

export default function GroupDetails() {
  const {groupId} = useParams();
  const dispatch = useDispatch();

  const group = useSelector(consumeOneGroup(groupId))
  const sessionUserId = useSelector(state => state.session.user?.id);

  let {GroupImages, name, city, state, about, numberEvents, isPrivate, eventType, Organizer, organizerId, description, listEvents} = group || {};

  const [previewImage, setPreviewImage] = useState();
  const [isOrganizer, setIsOrganizer] = useState(true);

  useEffect(() => {
    const imgUrl = GroupImages ? GroupImages.find(img => img.preview===true).url : ""
    setPreviewImage(imgUrl);
  }, [GroupImages]);

  useEffect(() => {
    setIsOrganizer(organizerId===sessionUserId)
  }, [organizerId, sessionUserId])

  useEffect(() => {
    async function getGroup() {
        return await dispatch(fetchGroupById(groupId))
            .catch(async (res) => {
                const data = await res.json();
                console.log(data.title, '-', data.message)
                // history.push('/not-found')
            })
    }

    getGroup()
  }, [groupId, dispatch])

  function joinGroupButton(e) {
    alert("Feature coming soon");
  }

  return (
    <>
    <div className="breadcrumb-link">
        <i className="fa-solid fa-angle-left"></i>
        <Link to='/groups'>Groups</Link>
    </div>
    <div className='group-details'>
        <img src={previewImage} alt="No preview image available"/>
        <div className='group-information'>
            <h2>{name}</h2>
            <h3 className="groups-thumbnail-grey">{city}, {state}</h3>
            <p>{about}</p>
            <div>
                <span className="groups-thumbnail-grey">{numberEvents} events</span>
                <span className="groups-thumbnail-grey"> · </span>
                <span className="groups-thumbnail-grey">{isPrivate}</span>
            </div>
            <button className={isOrganizer || !sessionUserId ? "hidden" : ""} onClick={joinGroupButton}>Join this group</button>
        </div>
    </div>
    <div>
        <h2>Organized by:</h2>
        <p>{Organizer?.firstName + ' ' + Organizer?.lastName}</p>
    </div>
    <div className={isOrganizer ? "" : "hidden"}>
        <button>Create event</button>
        <button>Update</button>
        <button>Delete</button>
    </div>
    <GroupEvents {...numberEvents}/>
    </>
  )
}
