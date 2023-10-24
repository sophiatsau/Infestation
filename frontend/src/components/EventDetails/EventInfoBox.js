import React from 'react'

export default function EventInfoBox({event}) {
  const {price, startDate, endDate, type} = event;
  const start = new Date(startDate);
  const end = new Date(endDate);

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
        <div>{type}</div>
      </div>
    </div>
  )
}
