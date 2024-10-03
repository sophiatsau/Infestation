import React from 'react'

export default function ViewAttendeesCard({attendee}) {
  return (<>
    <td>{attendee.firstName} {attendee.lastName}</td>
    <td>
      {attendee.Attendance.status}
      {/* ACCEPT PENDING, WAITLIST > ATTENDING for co-host of group */}
    </td>
    <td>
      {/* Delete attendance for co-host of group*/}
    </td>
  </>
  )
}
