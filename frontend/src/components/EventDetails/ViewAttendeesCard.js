import React from 'react'

export default function ViewAttendeesCard({attendee, isCoHost}) {
  const canApprove = attendee.Attendance.status==="pending" && isCoHost

  return (<>
    <td>{attendee.firstName} {attendee.lastName}</td>
    <td>
      {attendee.Attendance.status}
    </td>
    <td>
      {/* ACCEPT PENDING, WAITLIST > ATTENDING for co-host of group */}
      {canApprove && "Approve"}
    </td>
    <td>
      {/* Delete attendance for co-host of group*/}
    </td>
  </>
  )
}
