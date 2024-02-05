import { csrfFetch } from "./csrf";
import { REMOVE_USER } from "./session";

const GET_GROUP_MEMBERS = 'members/getGroupMembers'
const REQUEST_MEMBERSHIP = 'members/requestMembership'
const UPDATE_MEMBERSHIP = 'members/updateMembership'
const DELETE_MEMBERSHIP = 'members/deleteMembership'

const getGroupMembers = (payload) => {
    type: GET_GROUP_MEMBERS,
    payload
}

const requestMembership = (payload) => {
    type: REQUEST_MEMBERSHIP,
    payload
}

const updateMembership = (payload) => {
    type: UPDATE_MEMBERSHIP,
    payload
}

const deleteMembership = (membershipId) => {
    type: DELETE_MEMBERSHIP,
    membershipId
}

export const thunkGetGroupMembers = (groupId) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/members`)
    const data = await res.json();

    if (res.ok) dispatch(getGroupMembers(data))

    return data;
}

export const thunkRequestMembership = () => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/members`, {
        method: "POST"
    })
    const data = await res.json();

    if (res.ok) dispatch(requestMembership(data))

    return data;
}

const initialState = {}

const membersReducer = (state=initialState, action) => {
    switch (action.type) {
        case REMOVE_USER:
            return initialState
        case GET_GROUP_MEMBERS:
            return {...action.payload.Members}
        //TODO: update, request membership should be in session.user
        case REQUEST_MEMBERSHIP:
            return state
        default:
            return state
    }
}

export default membersReducer
