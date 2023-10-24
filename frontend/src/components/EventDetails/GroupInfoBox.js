import React from 'react'
import { Link } from 'react-router-dom';

export default function GroupInfoBox({group}) {
  console.log("🚀 ~ file: GroupInfoBox.js:4 ~ GroupInfoBox ~ group:", group)
  const {name, GroupImages, isPrivate, id} = group;
  const previewImage = GroupImages && GroupImages.find(image => image.preview);

  return (
    <Link to={`/groups/${id}`}>
      <img src={previewImage?.url}/>
      <div>
        <h3>{name}</h3>
        <p>{isPrivate}</p>
      </div>
    </Link>
  )
}
