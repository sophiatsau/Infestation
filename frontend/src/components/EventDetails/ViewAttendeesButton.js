import React from 'react'
import OpenModalButton from '../OpenModalButton'

import ViewAttendeesModal from './ViewAttendeesModal'
import { useSelector } from 'react-redux'
import { consumeOneEvent } from '../../store/events'

export default function ViewAttendeesButton() {
  const event = useSelector(consumeOneEvent())

  const buttonText = `View Attendees (${event.numAttending})`

  return (
    <OpenModalButton
        modalComponent={<ViewAttendeesModal groupId={event.groupId}/>}
        buttonText={buttonText}
        className={"view-attendees-button teal"}
    />
  )
}
