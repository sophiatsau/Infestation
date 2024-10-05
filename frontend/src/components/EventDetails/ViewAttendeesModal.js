import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { consumeEventAttendees, thunkGetAttendees } from '../../store/attendees'
import ViewAttendeesTable from './ViewAttendeesTable'

export default function ViewAttendeesModal({groupId}) {
  const attendees = useSelector(consumeEventAttendees())

  return (
    <div>
        <h1>Attendees</h1>
        {
            !attendees ? "Loading attendees..."
            : !attendees.length ? "No one is attending this event yet"
            : <ViewAttendeesTable attendees={attendees} groupId={groupId}/>
        }
    </div>
  )
}
