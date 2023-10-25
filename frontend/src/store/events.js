import { csrfFetch } from "./csrf";

const GET_ALL_EVENTS = 'events/getAllEvents';
const GET_ONE_EVENT = 'events/getOneEvent';
const CREATE_EVENT = 'events/createEvent';

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
    console.log("🚀 ~ file: events.js:55 ~ createNewEvent ~ eventData:", eventData)

    const resImage = await csrfFetch(`/api/events/${eventData.id}/images`, {
        method: 'POST',
        body: JSON.stringify({url, preview: true})
    })

    const dataImage = await resImage.json();
    console.log("🚀 ~ file: events.js:63 ~ createNewEvent ~ dataImage:", dataImage)

    if (eventRes.status < 400 && resImage.ok) {
        eventData.previewImage = resImage
        dispatch(createEvent(eventData))
    }

    return [eventData, dataImage]
}

export const consumeAllEvents = () => (state) => Object.values(state.events);

export const consumeOneEvent = (eventId) => (state) => state.events[eventId];


export function sortEvents(events) {
    events.forEach(event => event.startDate = new Date(event.startDate).getTime());

    //test past events
    // events.push({name: "old event", previewImage: null, startDate: new Date('10/20/23'), Group: {id: 1, name: 'Evening Tennis on the Water', city: 'New York', state: 'NY'}})

    events = events.sort((a,b) => {
      return a.startDate > b.startDate ? 1 : -1;
    });

    const index = events.findIndex(event => event.startDate > new Date().getTime());

    const pastEvents = events.slice(0,index)
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
            console.log("🚀 ~ file: events.js:111 ~ eventsReducer ~ action.event:", action.event)
            return {...state, [action.event.id]: action.event};
        }
        default:
            return state;
    }
};

export default eventsReducer;
