import React from 'react'

import OpenModalButton from '../OpenModalButton';
import DeleteModal from '../DeleteModal';

export default function EventInfoBox({event, isOrganizer}) {
  const {price, startDate, endDate, type, id, groupId} = event;
  const start = new Date(startDate);
  const end = new Date(endDate);

  const updateDeleteButtons = (
    <>
      {/* <button>Update</button> */}
      <OpenModalButton
          buttonText="Delete"
          modalComponent={<DeleteModal featureId={id} feature="event" groupId={groupId}/>}
      />
    </>
  )

  return (
    <div className="event-info-box">
      <i className="fa-solid fa-clock"></i>
      <i className="fa-solid fa-circle-dollar-to-slot"></i>
      <i className="fa-solid fa-map-pin"></i>
      <div className='event-info-time'>
        <span className='grey'>
          START
        </span>
        <span className='teal'>
          {` ${start.toLocaleDateString()} · ${start.toLocaleTimeString()}`}
        </span>
        <span className='grey'>
          END
        </span>
        <span className='teal'>
          {` ${end.toLocaleDateString()} · ${end.toLocaleTimeString()}`}
        </span>
      </div>
      <div className="event-info-price">{price>0 ? "$"+price : 'FREE'}</div>
      <div className="event-info-type">
        <span className="grey">{type}</span>
        <span className="event-delete-update">{isOrganizer ? updateDeleteButtons : null}</span>
      </div>
    </div>
  )
}
