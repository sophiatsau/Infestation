import React from 'react'
import ViewAttendeesCard from './ViewAttendeesCard'


export default function ViewAttendeesTable({attendees}) {
  return (
    <table id="attendees-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {attendees.map(attendee => (
                <tr key={attendee.id}>
                    <ViewAttendeesCard attendee={attendee} />
                </tr>
            ))}
        </tbody>
    </table>
  )
}
