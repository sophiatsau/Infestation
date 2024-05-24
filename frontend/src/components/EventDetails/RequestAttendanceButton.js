import React from 'react'

import OpenModalButton from '../OpenModalButton'
import RequestAttendanceModal from './RequestAttendanceModal'

export default function RequestAttendanceButton() {
  return (
    <OpenModalButton
      buttonText="Request Attendance"
      modalComponent={<RequestAttendanceModal />}
    />
  )
}
