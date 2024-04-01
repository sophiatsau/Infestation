import React from 'react'
import { useSelector } from 'react-redux'

import OpenModalButton from '../OpenModalButton'
import { consumeOneGroup } from '../../store/groups'
import RequestMembershipModal from './RequestMembershipModal'
import ViewStatusModal from './ViewStatusModal'

export default function RequestMembershipButton() {
  const user = useSelector(state => state.session.user)
  const group = useSelector(consumeOneGroup())

  const status = user.memberships[group.id]

  // if pending, member, co-host: can delete own membership
  // else, can request membership (change to pending)
  const buttonText =
    !status ? "Request Membership"
    : "View Membership Status"

  const modalComponent =
    !status ? <RequestMembershipModal />
    : <ViewStatusModal />

  return (
    <OpenModalButton
      buttonText={buttonText}
      modalComponent={modalComponent}
    />
  )
}
