import React from 'react'
import { useSelector } from 'react-redux'

import { consumeOneGroup } from '../../store/groups'

export default function ViewStatusModal() {
    const user = useSelector(state => state.session.user)
    const group = useSelector(consumeOneGroup())

    // open deletion dropdown menu
    const confirmDeletion = () => {
        return
    }

    return (
        <div>
            <h2>Your Membership Info</h2>
            <div>Name: {user.firstName} {user.lastName}</div>
            <div className='grey lighter small'>Status: {user.memberships[group.id]}</div>
            <button onClick={confirmDeletion}>Delete Membership</button>
            <div></div>
        </div>
    )
}
