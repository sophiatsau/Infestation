import { csrfFetch } from "./csrf"
import { GET_ONE_EVENT, CREATE_EVENT, DELETE_EVENT } from "./events"
import { GET_ALL_ATTENDEES, REQUEST_ATTENDANCE,UPDATE_ATTENDANCE, DELETE_ATTENDANCE } from "./actions"

const getEventAttendees = (payload) => {
    return {
        type: GET_ALL_ATTENDEES,
        payload
    }
}

const requestAttendance = (payload) => {
    return {
        type: REQUEST_ATTENDANCE,
        payload,
    }
}

const updateAttendance = (payload) => {
    return {
        type: UPDATE_ATTENDANCE,
        payload
    }
}

const deleteAttendance = (payload) => {
    return {
        type: DELETE_ATTENDANCE,
        payload
    }
}

const initialState = {}

const attendeesReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state
    }
}

export default attendeesReducer
