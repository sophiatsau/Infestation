import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import OpenModalButton from '../OpenModalButton';
import DeleteModal from '../DeleteModal';

export default function GroupDetailsInfo({group, setLoaded}) {
  let history = useHistory();

  let {GroupImages, name, city, state, about, numberEvents, isPrivate, Organizer, organizerId, id} = group || {};

  const sessionUserId = useSelector(state => state.session.user?.id);

  const [previewImage, setPreviewImage] = useState();
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    const imgUrl = GroupImages ? GroupImages.find(img => img.preview===true).url : ""
    setPreviewImage(imgUrl);
  }, [GroupImages]);

  useEffect(() => {
    setIsOrganizer(organizerId===sessionUserId)
  }, [organizerId, sessionUserId])

  function joinGroupButton(e) {
    alert("Feature coming soon");
  }

  return (
    <div>
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
            <button onClick={()=>history.push(`/groups/${group.id}/events/new`)}>Create event</button>
            <button onClick={()=>history.push(`/groups/${group.id}/edit`)}>Update</button>
            <button>
              <OpenModalButton
                buttonText="Delete"
                modalComponent={<DeleteModal featureId={id} feature="group"/>}
              />
            </button>
        </div>
    </div>
  )
}
