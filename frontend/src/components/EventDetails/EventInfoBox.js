import React from 'react'

import OpenModalButton from '../OpenModalButton';
import DeleteModal from '../DeleteModal';

export default function EventInfoBox({event, isOrganizer}) {
  const {price, startDate, endDate, type, id, groupId} = event;
  const start = new Date(startDate);
  const end = new Date(endDate);

  const updateDeleteButtons = (
    <>
      <button>Update</button>
      <button>
        <OpenModalButton
          buttonText="Delete"
          modalComponent={<DeleteModal featureId={id} feature="event" groupId={groupId}/>}
        />
      </button>
    </>
  )

  return (
    <div className="event-info-box">
      <div className="event-info-icons">
        <i className="fa-solid fa-clock"></i>
        <i className="fa-solid fa-circle-dollar-to-slot"></i>
        <i className="fa-solid fa-map-pin"></i>
      </div>
      <div className='event-info-details'>
        <div>
          <p>
            START
            <span>
              {` ${start.toLocaleDateString()} · ${start.toLocaleTimeString()}`}
            </span>
          </p>
          <p>
            END
            <span>
              {` ${end.toLocaleDateString()} · ${end.toLocaleTimeString()}`}
            </span>
          </p>
        </div>
        <div>{"$"+price || 'FREE'}</div>
        <div>
          {type}
          {isOrganizer ? updateDeleteButtons : null}
        </div>
      </div>
    </div>
  )
}
