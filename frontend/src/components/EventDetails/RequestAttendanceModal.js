import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../context/Modal'
import { consumeOneEvent } from '../../store/events'
import { thunkRequestAttendance } from '../../store/attendees'

export default function RequestAttendanceModal({user}) {
    const {closeModal} = useModal()
    const dispatch = useDispatch()

    const event = useSelector(consumeOneEvent())

    const requestAttendance = async () => {
        const res = await dispatch(thunkRequestAttendance(event.id, user))
        closeModal()
    }

    return (
        <div>
            <h2>Request attendance?</h2>
            <button onClick={requestAttendance}>Yes</button>
            <button onClick={closeModal}>No</button>
        </div>
    )
}
