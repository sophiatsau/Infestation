import React, { useEffect, useState, useRef } from 'react'
// import { useDispatch, useSelector } from 'react-redux'

export default function MembershipCard({membership, approveMembership, authorized}) {
    const [openMenu, setOpenMenu] = useState(false)
    const ulRef = useRef()
    // const user = useSelector(state => state.session.user)
    // const group = useSelector(state => state.groups.currentGroup)
    // const dispatch = useDispatch()

    useEffect(() => {
        if (!openMenu) return

        const closeMenu = (e) => {
            if (ulRef.current.contains(e.target)) return
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
            <div className={menuClass} ref={ulRef}>Menu</div>
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
