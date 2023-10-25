import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { createNewGroup } from '../../store/groups';

export default function GroupCreationPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [type, setType] = useState('');
  const [isPrivate, setIsPrivate] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [userSubmit, setUserSubmit] = useState(false);

  useEffect(() => {
    const [newCity, newState] = location.split(/,\s*/);
    setCity(newCity);
    setState(newState);
  }, [location])

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {city, state, name, about, type, private: isPrivate, url};

    try {
      const [newGroup,] = await dispatch(createNewGroup(payload))
      console.log("🚀 ~ file: index.js:35 ~ handleSubmit ~ newGroup:", newGroup)
      history.push(`/groups/${newGroup.id}`)
    } catch(e) {
      const newErrors = await e.json()
      setErrors(newErrors.errors);
    }
    // history.push('/')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Start a New Group</h1>
      <section>
        <h2>Set your group's location</h2>
        <p>Infestation groups meet locally, in person, and online. We'll connect you with insects in your area.</p>
        <input
          type="text"
          placeholder='City, STATE'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div className='form-error'>
          <p>
            {(errors.city||errors.state) && "City and state are required"}
          </p>
        </div>
      </section>
      <section>
        <h2>What will your group's name be?</h2>
        <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
        <input
          type="text"
          placeholder='What is your group name?'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className='form-error'>
          <p>{errors.name && "Name is required and must be 60 characters or less"}</p>
        </div>
      </section>
      <section>
        <h2>Describe the purpose of your group.</h2>
        <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
        <ol>
          <li>What's the purpose of the group?</li>
          <li>Who should join?</li>
          <li>What will you do at your events?</li>
        </ol>
        <textarea
          placeholder='Please write at least 50 characters'
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
        <div className='form-error'>
          <p>{errors?.about}</p>
        </div>
      </section>
      <section>
        <h2>Final steps...</h2>
        <div>
          <label htmlFor="type">Is this an in-person or online group?</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option default value="" disabled={!!type}>Choose an option</option>
            <option value="In person">In Person</option>
            <option value="Online">Online</option>
          </select>
          <div className='form-error'>
            <p>{errors.type && "Group must be either in person or online"}</p>
          </div>
        </div>
        <div>
          <label htmlFor="private">Is this group private or public?</label>
          <select id="private" value={isPrivate} onChange={(e) => setIsPrivate(e.target.value)}>
            <option default value="" disabled={!isPrivate.length}>Choose an option</option>
            <option value="true">Private</option>
            <option value="false">Public</option>
          </select>
          <div className='form-error'>
            <p>{errors.private && "Group must be either private or public"}</p>
          </div>
        </div>
        <div>
          <label>Please add an image URL for your group below:</label>
          <input type="text" placeholder='Image Url' value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
      </section>
      <button>Create Group</button>
    </form>
  )
}


/*
  function updateAbout(e) {
    const newAbout = e.target.value
    setAbout(newAbout);
    if (newAbout.length < 50) {
      setErrors({...errors, about: "Description needs 50 or more characters"})
    } else setErrors({...errors, about: null})
    // console.log(newAbout, newAbout.length, errors)
    console.log(errors.about)
  }
*/
