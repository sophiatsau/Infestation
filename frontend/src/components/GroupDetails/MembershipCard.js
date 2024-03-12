import React from 'react'
import { useSelector } from 'react-redux'

export default function MembershipCard({membership}) {
    const user = useSelector(state => state.session.user)
    // const group = useSelector(state => state.groups.currentGroup)
    return (
        <>
        <td>
            <div>{membership.firstName} {membership.lastName}</div>
            <div className='grey lighter small'>{membership.Membership.status}</div>
        </td>
        <td>
            {membership.Membership.status == "pending" && <button>Approve</button>}
        </td>
        </>
    )
}
