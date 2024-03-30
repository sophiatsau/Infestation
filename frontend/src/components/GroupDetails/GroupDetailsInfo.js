import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import OpenModalButton from '../OpenModalButton';
import DeleteModal from '../DeleteModal';
import ViewMembershipsButton from './ViewMembershipsButton';
import RequestMembershipButton from './RequestMembershipButton';

export default function GroupDetailsInfo({group, setLoaded}) {
  let history = useHistory();

  let {GroupImages, name, city, state, about, numberEvents, isPrivate, Organizer, organizerId, id} = group || {};

  const user = useSelector(state => state.session.user);

  const [previewImage, setPreviewImage] = useState();
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    const imgUrl = GroupImages ? GroupImages.find(img => img.preview===true).url : ""
    setPreviewImage(imgUrl);
  }, [GroupImages]);

  useEffect(() => {
    setIsOrganizer(organizerId===user?.id)
  }, [organizerId, user])

  // function joinGroupButton(e) {
  //   alert("Feature coming soon");
  // }

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
      )
    : user ? (
      <RequestMembershipButton />
    )
    : null
  )

  if (!Organizer) {
    return null;
  }

  return (
    <div>
        <div className='group-details'>
            <img src={previewImage} alt="No preview available"/>
            <div className='group-information'>
              <div>
                <h2>{name}</h2>
                <p className="groups-details-grey">{city}, {state}</p>
                <div>
                    <span className="groups-details-grey">{numberEvents} events</span>
                    <span className="groups-details-grey"> · </span>
                    <span className="groups-details-grey">{isPrivate}</span>
                </div>
                <p className="groups-details-grey">Organized by: {Organizer.firstName + ' ' + Organizer.lastName}</p>
              </div>
              <div id='button-options'>{buttonOptions}</div>
              <ViewMembershipsButton groupId={id}/>
            </div>
        </div>
        <div className='grey-bg'>
            <h2>Organizer</h2>
            <p className="groups-details-grey">{Organizer.firstName + ' ' + Organizer.lastName}</p>
            <h2>What we're about</h2>
            <p>{about}</p>
        </div>
    </div>
  )
}
