import React, { useEffect } from 'react'
import OpenModalButton from '../OpenModalButton'
import { useDispatch, useSelector } from 'react-redux'
import { thunkGetGroupMembers } from '../../store/members'

export default function ViewMembershipsButton({groupId}) {
  const memberships = useSelector(state => state.members)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(thunkGetGroupMembers(groupId))
  }, [memberships, dispatch])

  if (!Object.values(memberships).length) {
    return null
  }

  return (
    <OpenModalButton
      modalComponent={"List of Memberships"}
      buttonText={"View Memberships"}
      // className={}
    />
  )
}
