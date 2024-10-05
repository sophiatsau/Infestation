import React, {useState, useRef, useEffect} from 'react'
import { thunkUpdateAttendance, thunkDeleteAttendance } from '../../store/attendees'
import { useDispatch, useSelector } from 'react-redux'
import { consumeOneEvent } from '../../store/events'

export default function ViewAttendeesCard({attendee, isCoHost}) {
  const eventId = useSelector(consumeOneEvent()).id
  const dispatch = useDispatch()

  // drop down menu
  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef()
  const menuClass = openMenu ? "dropdown" : "hidden"

  const toggleMenu = () => setOpenMenu(!openMenu)

  useEffect(() => {
    if (!openMenu) return 

    const closeMenu = (e) => {
      if (!menuRef.current || menuRef.current.contains(e.target)) return 
      setOpenMenu(false)
    }

    document.addEventListener("click", closeMenu)
    return () => document.removeEventListener("click", closeMenu)
  }, [openMenu])

  // options on dropdown
  const updateAttendance = (status) => async () => {
    try {
      console.log(attendee.id)
      const res = await dispatch(thunkUpdateAttendance(eventId,attendee.id,status))

      if (process.env.NODE_ENV !== "production") {
        console.log("attendance update", res)
      }
    } catch(e) {
      if (process.env.NODE_ENV !== "production") {
        console.log(e)
      }
    }
    setOpenMenu(false)
  }

  const waitlist = ["Move to Waitlist", "waitlist"]
  const attending = ["Move to Attending", "attending"]

  const dropdownOptions = {
    attending: [waitlist],
    waitlist: [attending],
    pending: [attending, waitlist]
  }

  const approveAttendanceButton = <button onClick={toggleMenu}>Actions</button>

  // delete attendance
  const deleteAttendance = async () => {
    return
  }

  return (<>
    <td>{attendee.firstName} {attendee.lastName}</td>
    <td>
      {attendee.Attendance.status}
    </td>
    <td>
      {/* ACCEPT PENDING, WAITLIST > ATTENDING for co-host of group */}
      {isCoHost &&
      <>
        {approveAttendanceButton}
        <div className={menuClass} ref={menuRef}>
          {dropdownOptions[attendee.Attendance.status].map((option) => (
            <button key={option[1]} style={{margin:0, padding:"5px"}} className='light-button' onClick={updateAttendance(option[1])}>{option[0]}</button>
          ))}
        </div>
      </>
      }
    </td>
    <td>
      {/* Delete attendance for co-host of group*/}
    </td>
  </>
  )
}
