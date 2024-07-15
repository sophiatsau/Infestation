import { csrfFetch } from "./csrf"
import { GET_ONE_EVENT, CREATE_EVENT, consumeOneEvent } from "./events"
import { GET_ALL_ATTENDEES, REQUEST_ATTENDANCE,UPDATE_ATTENDANCE, DELETE_ATTENDANCE } from "./actions"
import { useSelector } from "react-redux"
import { REMOVE_USER } from "./session"

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
    // else console.log(data)

    return data
}

// user = {user, status: membership status}
export const thunkRequestAttendance = (eventId, user=null) => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}/attendance`, {
        method: 'POST',
    })
    const data = await res.json()

    if (res.ok) dispatch(requestAttendance({...data, eventId, user}))
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

    if (res.ok) dispatch(deleteAttendance({eventId, userId}))

    return data
}

export const consumeEventAttendees = () => (state) => useSelector(consumeOneEvent()).Attendees

const initialState = []

const attendeesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ONE_EVENT:
        case REMOVE_USER:
        case CREATE_EVENT:
            return initialState
        case GET_ALL_ATTENDEES:
            // console.log("action.payload.Attendees", action.payload.Attendees)
            return action.payload.Attendees
        case REQUEST_ATTENDANCE: { //only update if is event owner / co-host
            if (action.payload.user.status !== "co-host") {
                return state
            }
            return [...state,
                {
                    id: action.payload.userId,
                    firstName: action.payload.user.user.firstName,
                    lastName: action.payload.user.user.lastName,
                    Attendance: {status: "pending"}
                }
            ]
        }
        case UPDATE_ATTENDANCE: {
            // console.log(state,"state")
            return state.map(attendee => {
                return attendee.id === action.payload.userId ?
                    {
                        ...attendee,
                        Attendance: {status: action.payload.status}
                    } : attendee
            })
        }
        case DELETE_ATTENDANCE: {
            // console.log("payload", action.payload)
            // console.log("state", state)
            return state.filter(attendee => attendee.id !== action.payload.userId)
        }
        default:
            return state
    }
}

export default attendeesReducer
