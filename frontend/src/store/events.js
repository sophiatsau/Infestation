import { csrfFetch } from "./csrf";

const GET_ALL_EVENTS = 'events/getAllEvents';
const GET_ONE_EVENT = 'events/getOneEvent';
const CREATE_EVENT = 'events/createEvent';
const DELETE_EVENT = 'events/deleteEvent'

const getAllEvents = (events) => {
    return {
        type: GET_ALL_EVENTS,
        events
    }
}

const getOneEvent = (event) => {
    return {
        type: GET_ONE_EVENT,
        event,
    }
}

const createEvent = (event) => {
    return {
        type: CREATE_EVENT,
        event,
    }
}

const deleteEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        eventId,
    }
}

export const fetchAllEvents = () => async dispatch => {
    const res = await csrfFetch(`/api/events`);
    const data = await res.json();

    dispatch(getAllEvents(data.Events));
    return data;
}

export const fetchEventById = (eventId) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`);
    const data = await res.json();

    if (res.ok) {
        dispatch(getOneEvent(data));
    }
    return data;
}

export const createNewEvent = (payload) => async dispatch => {
    const {url, groupId, ...newEvent} = payload;

    const eventRes = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        body: JSON.stringify(newEvent)
    })

    const eventData = await eventRes.json();

    const resImage = await csrfFetch(`/api/events/${eventData.id}/images`, {
        method: 'POST',
        body: JSON.stringify({url, preview: true})
    })

    const dataImage = await resImage.json();

    if (eventRes.status < 400 && resImage.ok) {
        eventData.previewImage = dataImage
        dispatch(createEvent(eventData))
    }

    return [eventData, dataImage]
}

export const deleteOneEvent = (eventId) => async dispatch => {
    console.log(eventId)
    const res = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE'
    })

    if (res.ok) {
        dispatch(deleteEvent(eventId));
    }

    return res;
}

export const consumeAllEvents = () => (state) => Object.values(state.events);

export const consumeOneEvent = (eventId) => (state) => state.events[eventId];


export function sortEvents(events) {
    events.forEach(event => event.startDate = new Date(event.startDate).getTime());

    //test past events
    // events.push({name: "old event", previewImage: null, startDate: new Date('10/20/23'), Group: {id: 1, name: 'Evening Tennis on the Water', city: 'New York', state: 'NY'}})
    // events.push({name: "old event", previewImage: null, startDate: new Date('10/21/23'), Group: {id: 1, name: 'Evening Tennis on the Water', city: 'New York', state: 'NY'}})
    // events.push({name: "old event", previewImage: null, startDate: new Date('10/19/23'), Group: {id: 1, name: 'Evening Tennis on the Water', city: 'New York', state: 'NY'}})

    events = events.sort((a,b) => {
      return a.startDate > b.startDate ? 1 : -1;
    });

    const index = events.findIndex(event => event.startDate > new Date().getTime());

    const pastEvents = (events.slice(0,index)).reverse();
    const upcomingEvents = events.slice(index)

    return [upcomingEvents, pastEvents];
}


const initialState={};

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_EVENTS: {
            const newState = {};
            action.events.forEach(event => {
                newState[event.id] = event;
            })
            return newState;
        }
        case GET_ONE_EVENT: {
            return {...state, [action.event.id]: action.event};
        }
        case CREATE_EVENT: {
            return {...state, [action.event.id]: action.event};
        }
        case DELETE_EVENT: {
            const newState = {...state};
            delete newState[action.eventId];
            return newState;
        }
        default:
            return state;
    }
};

export default eventsReducer;
