import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';

export default function GroupsThumbnail({group}) {
  const {id, name, previewImage, isPrivate, city, state, about, numberEvents} = group;

  useEffect(() => {
    return
  }, [id])

  return (
    <Link to={`/groups/${id}`} className="group-item">
      <img src={previewImage}/>
      <div>
        <h2>{name}</h2>
        <h3 className="groups-thumbnail-grey">{city}, {state}</h3>
        <p>{about}</p>
        <span className="groups-thumbnail-grey">{numberEvents} events</span>
        <span className="groups-thumbnail-grey"> · </span>
        <span className="groups-thumbnail-grey">{isPrivate}</span>
      </div>
    </Link>
  )
}
