import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { consumeOneGroup } from '../../store/groups'
import { thunkDeleteMembership } from '../../store/members'
import { useModal } from '../../context/Modal'

export default function ViewStatusModal() {
    const user = useSelector(state => state.session.user)
    const group = useSelector(consumeOneGroup())
    const dispatch = useDispatch()
    const {closeModal} = useModal()

    const [openMenu, setOpenMenu] = useState(false)

    const toggleMenu = () => {
        setOpenMenu(!openMenu)
    }

    const deleteMembership = async () => {
        const res = await dispatch(thunkDeleteMembership(group.id, user.id))
        // make a banner message in future?
        if (process.env.NODE_ENV !== "production") {
            console.log(res)
        }
        closeModal()
    }

    const dropDownClass = openMenu ? "dropdown" : "hidden"

    return (
        <div>
            <h2>Your Membership Info</h2>
            <div>Name: {user.firstName} {user.lastName}</div>
            <div className='grey lighter small'>Status: {user.memberships[group.id]}</div>
            <button onClick={toggleMenu}>Delete Membership</button>
            <div className={dropDownClass} style={{left:"var(--margin-left"}}>
                Delete your membership?
                <div className='yes-no-buttons'>
                    <button onClick={deleteMembership}>Yes</button>
                    <button onClick={toggleMenu}>No</button>
                </div>
            </div>
        </div>
    )
}
