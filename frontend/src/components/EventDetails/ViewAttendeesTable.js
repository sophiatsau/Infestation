import React from 'react'


export default function ViewAttendeesTable({attendees}) {
  return (
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {attendees.map(attendee => (
                <tr key={attendee.id}>
                    <td>{attendee.firstName} {attendee.lastName}</td>
                    <td>{attendee.Attendance.status}</td>
                </tr>
            ))}
        </tbody>
    </table>
  )
}
