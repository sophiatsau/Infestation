import React from 'react'
import { Link } from 'react-router-dom';

export default function GroupInfoBox({group}) {
  const {name, GroupImages, isPrivate, id} = group;
  const previewImage = GroupImages && GroupImages.find(image => image.preview);

  return (
    <Link to={`/groups/${id}`} className="group-info-box">
      <img src={previewImage?.url} alt="Preview not available"/>
      <div>
        <h3 className='no-margin'>{name}</h3>
        <p className='no-margin grey'>{isPrivate}</p>
      </div>
    </Link>
  )
}
