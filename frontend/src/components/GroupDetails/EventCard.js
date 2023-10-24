import React from 'react'

export default function EventCard({event}) {
  const {previewImage, startDate, name, Group, description} = event;
  const dateTime = new Date(startDate);
  const location = `${Group.city}, ${Group.state}`

  return (
    <>
    <img src={previewImage} alt="No preview image available"/>
    <div>
      <p>{`${dateTime.toLocaleDateString()} · ${dateTime.toLocaleTimeString()}`}</p>
      <h3>{name}</h3>
      <p>{location}</p>
    </div>
    <p>
      {description}
    </p>
    </>
  )
}
