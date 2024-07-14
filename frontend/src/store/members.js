import { csrfFetch } from "./csrf";
import { REMOVE_USER } from "./session";
import { consumeOneGroup } from "./groups";
import { useSelector } from "react-redux";
import { UPDATE_MEMBERSHIP, GET_GROUP_MEMBERS, REQUEST_MEMBERSHIP, DELETE_MEMBERSHIP } from "./actions";

// export const GET_GROUP_MEMBERS = 'members/getGroupMembers'
// const REQUEST_MEMBERSHIP = 'members/requestMembership'
// export const UPDATE_MEMBERSHIP = 'members/updateMembership'
// const DELETE_MEMBERSHIP = 'members/deleteMembership'

const getGroupMembers = (payload) => {
    return {
        type: GET_GROUP_MEMBERS,
        payload
}}

const requestMembership = (payload, groupId) => {
    return {
        type: REQUEST_MEMBERSHIP,
        payload,
        groupId
}}

const updateMembership = (payload, groupId) => {
    return {
        type: UPDATE_MEMBERSHIP,
        payload,
        groupId
}}

const deleteMembership = (payload) => {
    return {
        type: DELETE_MEMBERSHIP,
        payload //groupId, memberId
}}

export const thunkGetGroupMembers = (groupId) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/members`)
    const data = await res.json();

    if (res.ok) dispatch(getGroupMembers(data))

    return data;
}

export const thunkRequestMembership = (groupId) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: "POST"
    })
    const data = await res.json();

    if (res.ok) dispatch(requestMembership(data, groupId))

    return data;
}

export const thunkUpdateMembership = (payload) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${payload.groupId}/membership`, {
        method: "PUT",
        body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (res.ok) dispatch(updateMembership(data, payload.groupId))

    return data
}

export const thunkDeleteMembership = (groupId, memberId) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: 'DELETE',
        body: JSON.stringify({memberId})
    })

    const data = await res.json()

    if (res.ok) dispatch(deleteMembership({groupId, memberId}))

    return data
}

export const consumeGroupMembers = () => (state) => useSelector(consumeOneGroup()).Members

const initialState = {}

const membersReducer = (state=initialState, action) => {
    switch (action.type) {
        case REMOVE_USER:
            return initialState
        case GET_GROUP_MEMBERS:
            const members = {}
            action.payload.Members.forEach(member => {
                members[member.id] = member
            });
            return members
        case UPDATE_MEMBERSHIP:
            console.log("members reducer", state)
            const updatedMembership = {...state[action.payload.memberId]}

            updatedMembership.Membership.status = action.payload.status

            return {...state, [action.payload.memberId]: updatedMembership}
        // case REQUEST_MEMBERSHIP:
        //     return state
        case DELETE_MEMBERSHIP: {
            const newState = {...state}
            delete newState[action.payload.memberId]
            return newState
        }
        default:
            return state
    }
}

export default membersReducer
