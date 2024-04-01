import React, { useEffect, useState, useRef } from 'react'
// import { useDispatch, useSelector } from 'react-redux'

export default function MembershipCard({membership, approveMembership, authorized, isOrganizer}) {
    const [openMenu, setOpenMenu] = useState(false)
    const ulRef = useRef()
    // const user = useSelector(state => state.session.user)
    // const group = useSelector(state => state.groups.currentGroup)
    // const isOrganizer = user.id === group.organizerId
    // const dispatch = useDispatch()

    useEffect(() => {
        if (!openMenu) return

        const closeMenu = (e) => {
            // account also for clicking outside of modal (ulRef.current === null)
            if (!ulRef.current || ulRef.current.contains(e.target)) return
            setOpenMenu(false)
        }

        document.addEventListener("click", closeMenu)
        return () => document.removeEventListener("click", closeMenu)
    }, [openMenu])

    const toggleMenu = () => setOpenMenu(!openMenu)

    const menuClass = openMenu ? "dropdown" : "hidden"

    const dropdownOptions = (
        <>
            <button className='light-button' onClick={toggleMenu}>
                <i class="fa-solid fa-ellipsis"></i>
            </button>
            <ul className={menuClass} ref={ulRef}>
                {isOrganizer && <li><button className='light-button'>Make Co-Host</button></li>}
                <li><button className='light-button'>Remove Member</button></li>
            </ul>
        </>
    )

    return (
        <>
        <td>
            <div>{membership.firstName} {membership.lastName}</div>
            <div className='grey lighter small'>{membership.Membership.status}</div>
        </td>
        <td>
            {membership.Membership.status === "pending" && <button onClick={() => approveMembership(membership)}>Approve</button>}
        </td>
        <td>
            {authorized && dropdownOptions}
        </td>
        </>
    )
}
