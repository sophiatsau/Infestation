import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import OpenModalButton from '../OpenModalButton'
import { consumeOneGroup } from '../../store/groups'

export default function RequestMembershipButton() {
  const user = useSelector(state => state.session.user)
  const group = useSelector(consumeOneGroup())

  const status = user.memberships[group.id]
  const buttonText =
    status==="pending" ? "Membership Requested"
    : !status ? "Request Membership"
    : "Already a Member"

  return (
    <OpenModalButton
      buttonText={buttonText}
    />
  )
}
