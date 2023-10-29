import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { createNewEvent } from '../../store/events';
import { consumeOneGroup, fetchGroupById } from '../../store/groups';
import './EventCreationPage.css';

export default function GroupCreationPage() {
  const history = useHistory();
  const {groupId} = useParams();
  const dispatch = useDispatch();

  const sessionUserId = useSelector(state => state.session.user?.id);
  const group = useSelector(consumeOneGroup(groupId));
  const {organizerId} = group || {}

  if (!sessionUserId ||
    (sessionUserId && organizerId && sessionUserId!==organizerId)) {
      history.push('/unauthorized');
  }

  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    window.scroll(0,0)
  }, [])

  useEffect(() => {
    setIsOrganizer(organizerId===sessionUserId)
  }, [organizerId, sessionUserId])

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState({});
  const [userSubmit, setUserSubmit] = useState(false);

  useEffect(() => {
    dispatch(fetchGroupById(groupId));
  }, [dispatch, groupId])

  useEffect(() => {
    const err = {};

    if (!name) err.name="Name is required"
    if (!type) err.type="Event Type is required"
    if (!price) err.price="Price is required"
    if (!capacity) err.capacity="Capacity is required"
    if (!startDate) err.startDate="Event start is required"
    if (!endDate) err.endDate="Event end is required"
    if (!['.png', `.jpg`, `.jpeg`].find(end => url.endsWith(end))) err.url="Image URL must end in .png, .jpg, or .jpeg"
    if (description.length < 30) err.description="Description must be at least 30 characters long"

    setErrors(err)
  }, [name, type, price, capacity, startDate, endDate, description, url])

  async function handleSubmit(e) {
    e.preventDefault();
    setUserSubmit(true);

    const payload = {name, type, price, startDate, endDate, description, capacity: 5, url, groupId};

    if (Object.values(errors).length) return;

    try {
      const [newEvent,] = await dispatch(createNewEvent(payload))
      history.push(`/events/${newEvent.id}`)
    } catch(e) {
      const newErrors = await e.json()
      setErrors(newErrors.errors);
    }
  }

  if (!isOrganizer) return null;

  return (
    <form id="event-create-form" onSubmit={handleSubmit}>
      <h1>Create a new event for {group.name}</h1>
      <section>
        <label htmlFor='event-name'>What is the name of your event?</label>
        <input
          id="event-name"
          type="text"
          placeholder='Event Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className='form-error'>
          <p>
            {userSubmit && errors.name}
          </p>
        </div>
      </section>
      <section className='top-grey-line'>
        <div>
          <label htmlFor="event-type">Is this an in-person or online event?</label>
          <select id="event-type" value={type} onChange={(e) => setType(e.target.value)}>
            <option default value="" disabled={!!type}>Choose an option</option>
            <option value="In person">In Person</option>
            <option value="Online">Online</option>
          </select>
          <div className='form-error'>
            <p>{userSubmit && errors.type}</p>
          </div>
        </div>
        <label htmlFor='event-price'>
          What is the price for your event?
        </label>
        <input
          id="event-price"
          type="number"
          min={0}
          placeholder='0'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <div className='form-error'>
          <p>
            {userSubmit && errors.price}
          </p>
        </div>
        <label htmlFor='event-capacity'>
          What is the capacity for your event?
        </label>
        <input
          id="event-capacity"
          type="number"
          min={0}
          placeholder='0'
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        <div className='form-error'>
          <p>
            {userSubmit && errors.capacity}
          </p>
        </div>
      </section>
      <section className='top-grey-line'>
        <div>
          <label htmlFor="event-start">When does your event start?</label>
          <input
            id="event-start"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder='MM/DD/YYYY HH:mm'
          />
          <i className="fa-regular fa-calendar-days"></i>
          <div className='form-error'>
            <p>{userSubmit && errors.startDate}</p>
          </div>
        </div>
        <div>
          <label htmlFor="event-end">When does your event end?</label>
          <input
            id="event-end"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder='MM/DD/YYYY HH:mm'
          />
          <i className="fa-regular fa-calendar-days"></i>
          <div className='form-error'>
            <p>{userSubmit && errors.endDate}</p>
          </div>
        </div>
      </section>
      <section className='top-grey-line'>
        <div>
          <label>Please add in image url for your event below:</label>
          <input type="text" placeholder='Image Url' value={url} onChange={(e) => setUrl(e.target.value)} />
          <div className='form-error'>
            <p>{userSubmit && errors.url}</p>
          </div>
        </div>
      </section>
      <section className='top-grey-line'>
        <label htmlFor="event-description">Please describe your event:</label>
        <textarea
          id="event-description"
          placeholder='Please write at least 30 characters'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className='form-error'>
          <p>{userSubmit && errors?.description}</p>
        </div>
      </section>
      <button className="feature-create-button">Create Event</button>
    </form>
  )
}
