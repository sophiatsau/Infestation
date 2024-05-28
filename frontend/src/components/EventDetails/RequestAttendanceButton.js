import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import OpenModalButton from '../OpenModalButton'
import RequestAttendanceModal from './RequestAttendanceModal'
import ViewAttendanceStatus from './ViewAttendanceStatus'
import { consumeOneEvent } from '../../store/events'

export default function RequestAttendanceButton() {
  const user = useSelector(state => state.session.user)
  const event = useSelector(consumeOneEvent())
  const status = user.attendances[event.id]
  const isMember = user.memberships[event.groupId]

  if (!isMember || isMember === "pending") return null

  const buttonText = status ? "View Attendance Status" : "Request Attendance"

  const modalComponent = status ? <ViewAttendanceStatus /> : <RequestAttendanceModal />

  return (
    <OpenModalButton
      buttonText={buttonText}
      modalComponent={modalComponent}
    />
  )
}
