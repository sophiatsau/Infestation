import React from 'react'
import { useDispatch } from 'react-redux'
import MembershipCard from './MembershipCard'
import { thunkUpdateMembership } from '../../store/members'


export default function MembershipsTable({memberships}) {
  const dispatch = useDispatch()

  const approveMembership = async (membership) => {
    const {memberId, groupId, status} = membership
    console.log(membership, "memberships table membership")

    // if success, add to list of memberships
    try {
      const resMember = await dispatch(thunkUpdateMembership({memberId, groupId, status}))
      console.log(resMember, "ACCEPTED MEMBER!")
    } catch(e) {
      console.log(e)
    }
    // if fail, console log
  }

  return (
    <table id="memberships-table">
      <tbody>
        {Object.values(memberships).map(membership =>(
            <tr key={membership.id}>
                <MembershipCard membership={membership} approveMembership={approveMembership}/>
            </tr>
        ))}
      </tbody>
    </table>
  )
}
