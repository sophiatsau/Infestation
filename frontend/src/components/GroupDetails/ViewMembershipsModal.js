import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { thunkGetGroupMembers } from '../../store/members'

export default function ViewMembershipsModal({groupId}) {
    const memberships = useSelector(state => state.members)
    const [isLoaded, setIsLoaded] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(thunkGetGroupMembers(groupId)).then(()=>setIsLoaded(true))
    }, [memberships, dispatch, setIsLoaded])

    return (
    <>
        <h1>Members</h1>
        {
            !isLoaded ? "Loading memberships..."
            : !Object.values(memberships).length ? "There are no members in this group"
            : Object.values(memberships).map(membership =>(
                <div key={membership.id}>
                    <span>{membership.firstName} {membership.lastName}</span> <span>{membership.Membership.status}</span>
                </div>
            ))
        }
    </>
  )
}
