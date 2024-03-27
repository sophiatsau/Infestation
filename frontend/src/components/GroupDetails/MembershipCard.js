import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'

export default function MembershipCard({membership, approveMembership}) {
    // const user = useSelector(state => state.session.user)
    // const group = useSelector(state => state.groups.currentGroup)
    // const dispatch = useDispatch()

    // const approveMembership = () => {
    //     //
    // }

    return (
        <>
        <td>
            <div>{membership.firstName} {membership.lastName}</div>
            <div className='grey lighter small'>{membership.Membership.status}</div>
        </td>
        <td>
            {membership.Membership.status === "pending" && <button onClick={() => approveMembership(membership)}>Approve</button>}
        </td>
        </>
    )
}
