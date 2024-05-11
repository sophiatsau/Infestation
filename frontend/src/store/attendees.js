import { csrfFetch } from "./csrf"
import { GET_ONE_EVENT, CREATE_EVENT, DELETE_EVENT, consumeOneEvent } from "./events"
import { GET_ALL_ATTENDEES, REQUEST_ATTENDANCE,UPDATE_ATTENDANCE, DELETE_ATTENDANCE } from "./actions"
import { useSelector } from "react-redux"

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

export const thunkGetAttendees = (eventId) => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}/attendees`)
    const data = await res.json()

    if (res.ok) dispatch(getEventAttendees(data))

    return data
}

export const consumeEventAttendees = () => (state) => useSelector(consumeOneEvent()).Attendees

const initialState = []

const attendeesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_ATTENDEES:
            return action.payload.Attendees
        default:
            return state
    }
}

export default attendeesReducer
