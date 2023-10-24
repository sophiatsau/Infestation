import React from 'react'
import { Link } from 'react-router-dom';

export default function GroupInfoBox({group}) {
  const {name, GroupImages, isPrivate, id} = group;
  const previewImage = GroupImages && GroupImages.find(image => image.preview);

  return (
    <Link to={`/groups/${id}`}>
      <div className="group-info-box" >
        <img src={previewImage?.url}/>
        <div>
          <h3>{name}</h3>
          <p>{isPrivate}</p>
        </div>
      </div>
    </Link>
  )
}
