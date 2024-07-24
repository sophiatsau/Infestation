import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useModal } from '../../context/Modal'
import { consumeOneEvent } from '../../store/events'
import { thunkDeleteAttendance } from '../../store/attendees'

export default function ViewAttendanceStatus() {
  const user = useSelector(state => state.session.user)
  const event = useSelector(consumeOneEvent())
  const dispatch = useDispatch()
  const {closeModal} = useModal()

  const [openMenu, setOpenMenu] = useState(false)

  const toggleMenu = () => setOpenMenu(!openMenu)

  const deleteAttendance = async () => {
    const res = await dispatch(thunkDeleteAttendance(event.id, user.id))

    if (process.env.NODE_ENV !== "production") {
      console.log(res)
    }

    closeModal()
  }

  const dropDownClass = openMenu ? "dropdown" : "hidden"

  return (
    <div>
      <h2>Your Attendance Status</h2>
      <div>Name: {user.firstName} {user.lastName}</div>
      <div className='grey lighter small'>Status: {user.attendances[event.id]}</div>
      <button onClick={toggleMenu}>Delete Attendance</button>
      <div className={dropDownClass}>
        Delete your attendance?
        <button onClick={deleteAttendance}>Yes</button>
        <button onClick={toggleMenu}>No</button>
      </div>
    </div>
  )
}
