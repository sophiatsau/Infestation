import React from 'react'
import { useSelector } from 'react-redux'
import ViewAttendeesCard from './ViewAttendeesCard'


export default function ViewAttendeesTable({attendees, groupId}) {
    // get current user's status. if co-host of event's group', return true
  const user = useSelector(state => state.session.user)
  const isCoHost = user ? user.memberships[groupId]==="co-host" : null
  
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
                    <ViewAttendeesCard {...{attendee, isCoHost}} />
                </tr>
            ))}
        </tbody>
    </table>
  )
}
