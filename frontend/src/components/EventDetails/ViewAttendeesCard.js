import React, {useState, useRef} from 'react'

export default function ViewAttendeesCard({attendee, isCoHost}) {
  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef()
  const menuClass = openMenu ? "modal-table-dropdown" : "hidden"

  const canApprove = attendee.Attendance.status!=="attending" && isCoHost

  const toggleMenu = () => setOpenMenu(!openMenu)

  const approveAttendance = () => {
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
      {canApprove &&
      <>
        {approveAttendanceButton}
        <div class={menuClass} ref={menuRef}>
          the menu
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
