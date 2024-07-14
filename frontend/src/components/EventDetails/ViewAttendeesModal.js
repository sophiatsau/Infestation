import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { consumeEventAttendees, thunkGetAttendees } from '../../store/attendees'
import ViewAttendeesTable from './ViewAttendeesTable'

export default function ViewAttendeesModal({eventId}) {
  const attendees = useSelector(consumeEventAttendees())
  // console.log("🚀 ~ ViewAttendeesModal ~ attendees:", attendees)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!attendees) dispatch(thunkGetAttendees(eventId))
  }, [attendees, dispatch])

  return (
    <div>
        <h1>Attendees</h1>
        {
            !attendees ? "Loading attendees..."
            : !attendees.length ? "No one is attending this event yet"
            : <ViewAttendeesTable attendees={attendees}/>
        }
    </div>
  )
}
