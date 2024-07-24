import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'

export default function MembershipCard({membership, approveMembership, authorized, isOrganizer, deleteMembership, makeCoHost}) {
    const [openMenu, setOpenMenu] = useState(false)
    const divRef = useRef()
    const user = useSelector(state => state.session.user)
    // const group = useSelector(state => state.groups.currentGroup)
    // const isOrganizer = user.id === group.organizerId
    // const dispatch = useDispatch()

    useEffect(() => {
        if (!openMenu) return

        const closeMenu = (e) => {
            // account also for clicking outside of modal (divRef.current === null)
            if (!divRef.current || divRef.current.contains(e.target)) return
            setOpenMenu(false)
        }

        document.addEventListener("click", closeMenu)
        return () => document.removeEventListener("click", closeMenu)
    }, [openMenu])

    const toggleMenu = () => setOpenMenu(!openMenu)

    const menuClass = openMenu ? "modal-table-dropdown" : "hidden"

    const dropdownOptions = (
        <>
            <button className='light-button' onClick={toggleMenu}>
                <i className="fa-solid fa-ellipsis"></i>
            </button>
            <div className={menuClass} ref={divRef}>
                {isOrganizer && membership.Membership.status ==="member" &&
                <button style={{margin:0}} className='light-button' onClick={makeCoHost(membership, toggleMenu)}>Make Co-Host</button>}
                <button style={{margin:0}} className='light-button' onClick={deleteMembership(membership)}>Remove Member</button>
            </div>
        </>
    )

    return (
        <>
        <td>
            <div>{membership.firstName} {membership.lastName}</div>
            <div className='grey lighter small'>{membership.Membership.status}</div>
        </td>
        <td>
            {membership.Membership.status === "pending" && <button style={{margin:0}} onClick={approveMembership(membership)}>Approve</button>}
        </td>
        <td>
            {isOrganizer && membership.id !== user.id && dropdownOptions}
        </td>
        </>
    )
}
