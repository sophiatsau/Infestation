import React from 'react'
import { useSelector } from 'react-redux'
import MembershipsTable from './MembershipsTable'
import { consumeGroupMembers } from '../../store/members'

export default function ViewMembershipsModal({groupId}) {
    const memberships = useSelector(consumeGroupMembers())

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
