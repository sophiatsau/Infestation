import React from 'react'
import OpenModalButton from '../OpenModalButton'

import ViewMembershipsModal from './ViewMembershipsModal'

export default function ViewMembershipsButton({groupId}) {

  return (
    <OpenModalButton
      modalComponent={<ViewMembershipsModal groupId={groupId}/>}
      buttonText={"View Memberships"}
      // className={}
    />
  )
}
