import React from 'react'
import OpenModalButton from '../OpenModalButton'

import ViewMembershipsModal from './ViewMembershipsModal'
import { useSelector } from 'react-redux'

export default function ViewMembershipsButton({groupId}) {
  const user = useSelector(state => state.session.user)

  if (!user) return null

  return (
    <OpenModalButton
      modalComponent={<ViewMembershipsModal groupId={groupId}/>}
      buttonText={"View Members"}
      // className={}
    />
  )
}
