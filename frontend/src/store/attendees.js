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

const deleteAttendance = (userId) => {
    return {
        type: DELETE_ATTENDANCE,
        userId
    }
}

export const thunkGetAttendees = (eventId) => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}/attendees`)
    const data = await res.json()

    if (res.ok) dispatch(getEventAttendees(data))
    // else console.log(data)

    return data
}

export const thunkRequestAttendance = (eventId) => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}/attendance`, {
        method: 'POST',
    })
    const data = await res.json()

    if (res.ok) dispatch(requestAttendance({...data, eventId}))
    // else console.log(data)

    return data
}

export const thunkUpdateAttendance = (eventId, userId, status) => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}/attendance`, {
        method: 'PUT',
        body: JSON.stringify({ userId, status })
    })
    const data = await res.json()

    if (res.ok) dispatch(updateAttendance(data))

    return data
}

export const thunkDeleteAttendance = (eventId, userId) => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}/attendance`, {
        method: 'DELETE',
        body: JSON.stringify({ userId })
    })

    const data = await res.json()

    if (res.ok) dispatch(deleteAttendance(userId))

    return data
}

export const consumeEventAttendees = () => (state) => useSelector(consumeOneEvent()).Attendees

const initialState = []

const attendeesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ONE_EVENT:
        case CREATE_EVENT:
            return initialState
        case GET_ALL_ATTENDEES:
            return action.payload.Attendees
        // TODO: move this into session slice of state
        case REQUEST_ATTENDANCE: {
            return state
        }
        case UPDATE_ATTENDANCE: {
            const newState = []
            state.forEach(attendee => {
                newState.push(attendee.id = action.payload.userId ?
                    {
                        ...attendee,
                        Attendance: {status: action.payload.status}
                    } : attendee
                )
            })
            return newState
        }
        case DELETE_ATTENDANCE: {
            return state.filter(attendee => attendee.id !== action.userId)
        }
        default:
            return state
    }
}

export default attendeesReducer
