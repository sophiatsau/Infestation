import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { thunkGetGroupMembers } from '../../store/members'
// import MembershipCard from './MembershipCard'
import MembershipsTable from './MembershipsTable'

export default function ViewMembershipsModal({groupId}) {
    const memberships = useSelector(state => state.members)
    const [isLoaded, setIsLoaded] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(thunkGetGroupMembers(groupId)).then(()=>setIsLoaded(true))
    }, [memberships, dispatch, setIsLoaded])

    if (!isLoaded) return <>Loading...</>

    return (
    <div id="memberships-modal">
        <h1>Members</h1>
        {
            !isLoaded ? "Loading memberships..."
            : !Object.values(memberships).length ? "There are no members in this group"
            : <MembershipsTable memberships={memberships}/>
        }
    </div>
  )
}
