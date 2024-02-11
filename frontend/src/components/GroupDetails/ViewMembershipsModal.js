import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { thunkGetGroupMembers } from '../../store/members'

export default function ViewMembershipsModal({groupId}) {
    const memberships = useSelector(state => state.members)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(thunkGetGroupMembers(groupId))
    }, [memberships, dispatch])

    return (
    <>
        <h1>Members</h1>
        {
            !Object.values(memberships).length ? "Loading memberships..."
            : Object.values(memberships).map(membership =>(
                <div key={membership.id}>
                    <span>{membership.firstName} {membership.lastName}</span> <span>{membership.Membership.status}</span>
                </div>
            ))
        }
    </>
  )
}
