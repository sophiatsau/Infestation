import React from 'react'

export default function GroupsThumbnail({group}) {
  const {id, name, previewImage, isPrivate, city, state, about, numberEvents} = group;

  return (
    <div className="group-item">
      <img src={previewImage}/>
      <h2>{name}</h2>
      <h3>{city}, {state}</h3>
      <p>{about}</p>
      <span>{numberEvents}</span>
      <span>·</span>
      <span>{isPrivate}</span>
    </div>
  )
}
