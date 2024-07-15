import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { thunkGetGroupMembers } from '../../store/members'
// import MembershipCard from './MembershipCard'
import MembershipsTable from './MembershipsTable'
import { consumeGroupMembers } from '../../store/members'

export default function ViewMembershipsModal({groupId}) {
    const memberships = useSelector(consumeGroupMembers())
    const dispatch = useDispatch()

    // useEffect(() => {
    //     if (!memberships) dispatch(thunkGetGroupMembers(groupId))
    // }, [memberships, dispatch, groupId])

    if (!memberships) return <>Loading...</>

    return (
    <div id="memberships-modal">
        <h1>Members</h1>
        {
            !memberships ? "Loading memberships..."
            : !Object.values(memberships).length ? "There are no members in this group"
            : <MembershipsTable memberships={memberships} groupId={groupId}/>
        }
    </div>
  )
}
