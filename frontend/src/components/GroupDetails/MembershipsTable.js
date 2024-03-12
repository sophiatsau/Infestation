import React from 'react'
import MembershipCard from './MembershipCard'

export default function MembershipsTable({memberships}) {
  return (
    <table id="memberships-table">
        {Object.values(memberships).map(membership =>(
            <tr key={membership.id}>
                <MembershipCard membership={membership}/>
            </tr>
        ))}
    </table>
  )
}
