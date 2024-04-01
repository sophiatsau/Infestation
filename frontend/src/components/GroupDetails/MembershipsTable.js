import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MembershipCard from './MembershipCard'
import { thunkUpdateMembership } from '../../store/members'


export default function MembershipsTable({memberships, groupId}) {
  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  // const group = useSelector(state => state.groups.currentGroup)
  const authorized = user.memberships[groupId] === "co-host"

  const approveMembership = async (membership) => {
    const {id} = membership

    // TODO: add banner message to confirm success v errors
    // if success, add to list of memberships
    try {
      const resMember = await dispatch(thunkUpdateMembership({memberId: id, groupId, status: "member"}))
      // console.log(resMember, "ACCEPTED MEMBER!")
    } catch(e) {
      // console.log(e)
    }
  }

  // const props = {membership, approveMembership}

  //TODO: if is organizer or co-host, access buttons for removing, promoting members

  return (
    <table id="memberships-table">
      <tbody>
        {Object.values(memberships).map(membership =>(
            <tr key={membership.id}>
                <MembershipCard {...{membership, approveMembership, authorized}}/>
            </tr>
        ))}
      </tbody>
    </table>
  )
}
