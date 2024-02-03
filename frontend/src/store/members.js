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

const initialState = {}

const membersReducer = (state=initialState, action) => {
    switch (action.type) {
        case REMOVE_USER:
            return initialState
        default:
            return state
    }
}

export default membersReducer
