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

  // const [status, setStatus] = useState(user.attendances[event.id])

  // useEffect(() => {
  //   setStatus(user.attendances[event.id])
  // }, [user.attendances, event.id])

  // console.log("🚀 ~ useEffect ~ user.attendances:", user.attendances, "event.id", event.id)
  // console.log("🚀 ~ useEffect ~ user.attendances[event.id]:", user.attendances[event.id])
  // console.log("🚀 ~ useEffect ~ user.attendances[2]:", user.attendances[2])
  // console.log("🚀 ~ useEffect ~ user.attendances[1]:", user.attendances[1])
  // console.log("🚀 ~ useEffect ~ Object.entries(user.attendances):", Object.entries(user.attendances))

  // console.log("🚀 ~ useEffect ~ user.attendances['2']:", user.attendances["2"])


  console.log("status", status, "user", user)

  const buttonText = status ? "View Attendance Status" : "Request Attendance"

  const modalComponent = status ? <ViewAttendanceStatus /> : <RequestAttendanceModal />

  return (
    <OpenModalButton
      buttonText={buttonText}
      modalComponent={modalComponent}
    />
  )
}
