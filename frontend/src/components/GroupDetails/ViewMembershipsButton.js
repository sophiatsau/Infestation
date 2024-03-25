import React from 'react'
import OpenModalButton from '../OpenModalButton'

import ViewMembershipsModal from './ViewMembershipsModal'
import { useSelector } from 'react-redux'
import { consumeOneGroup } from '../../store/groups'

export default function ViewMembershipsButton({groupId}) {
  const user = useSelector(state => state.session.user)
  const group = useSelector(consumeOneGroup())

  if (!user) return null

  const buttonText = `View Members (${group.numMembers}) ${group.numPending ? `(${group.numPending} pending)` : ''}`

  return (
    <OpenModalButton
      modalComponent={<ViewMembershipsModal groupId={groupId}/>}
      buttonText={buttonText}
      className={"view-members-button teal"}
    />
  )
}
