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

  const buttonOptions = (
    isOrganizer ? (
      <>
        <button onClick={()=>history.push(`/groups/${group.id}/events/new`)}>Create event</button>
        <button onClick={()=>history.push(`/groups/${group.id}/edit`)}>Update</button>
        <OpenModalButton
          buttonText="Delete"
          modalComponent={<DeleteModal featureId={id} feature="group"/>}
        />
      </>
    ) : sessionUserId ? (
      <button className="join-group-button" onClick={joinGroupButton}>Join this group</button>
    ) : null
  )

  return (
    <div>
        <div className='group-details'>
            <img src={previewImage} alt="No preview image available"/>
            <div className='group-information'>
              <div>
                <h2>{name}</h2>
                <p className="groups-details-grey">{city}, {state}</p>
                <div>
                    <span className="groups-details-grey">{numberEvents} events</span>
                    <span className="groups-details-grey"> · </span>
                    <span className="groups-details-grey">{isPrivate}</span>
                </div>
                <p className="groups-details-grey">Organized by: {Organizer?.firstName + ' ' + Organizer?.lastName}</p>
              </div>
              <div className='button-options'>{buttonOptions}</div>
            </div>
        </div>
        <div className='grey-bg'>
            <h2>Organizer</h2>
            <p className="groups-details-grey">{Organizer?.firstName + ' ' + Organizer?.lastName}</p>
            <h2>What we're about</h2>
            <p>{about}</p>
        </div>
    </div>
  )
}
