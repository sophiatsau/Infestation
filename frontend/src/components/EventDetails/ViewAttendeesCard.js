import React, {useState, useRef, useEffect} from 'react'

export default function ViewAttendeesCard({attendee, isCoHost}) {
  const canApprove = attendee.Attendance.status!=="attending" && isCoHost

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
  const moveToWaitlist = async () => {
    setOpenMenu(false)
    return console.log("Adding to Waitlist")
  }

  const moveToAttending = async () => {
    setOpenMenu(false)
    return console.log("Adding to Attending")
  }

  const waitlist = ["Move to Waitlist", moveToWaitlist]
  const attending = ["Move to Attending", moveToAttending]

  const dropdownOptions = {
    attending: [waitlist],
    waitlist: [attending],
    pending: [attending, waitlist]
  }

  const deleteAttendance = async () => {
    return
  }

  // when pressed, open dropdown menu
  // dropdown menu: has options. PENDING: move to waitlist, move to attending. WAITLIST: move to attending. ATTENDING: move to waitlist
  const approveAttendanceButton = <button onClick={toggleMenu}>Actions</button>

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
        <div class={menuClass} ref={menuRef}>
          {dropdownOptions[attendee.Attendance.status].map((option) => (
            <button style={{margin:0, padding:"5px"}} className='light-button' onClick={option[1]}>{option[0]}</button>
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
