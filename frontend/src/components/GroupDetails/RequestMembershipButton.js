import React from 'react'
import { useSelector } from 'react-redux'

import OpenModalButton from '../OpenModalButton'
import { consumeOneGroup } from '../../store/groups'
import UpdateMembershipModal from './UpdateMembershipModal'

export default function RequestMembershipButton() {
  const user = useSelector(state => state.session.user)
  const group = useSelector(consumeOneGroup())

  const status = user.memberships[group.id]

  // if pending, member, co-host: can delete own membership
  // else, can request membership (change to pending)
  const buttonText =
    status==="pending" ? "Membership Pending"
    : !status ? "Request Membership"
    : "View Membership"

  const modalComponent =
    status==="pending" ? "Remove Pending Request?"
    : !status ? <UpdateMembershipModal />
    : "Edit Membership"

  return (
    <OpenModalButton
      buttonText={buttonText}
      modalComponent={modalComponent}
    />
  )
}
