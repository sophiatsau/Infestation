import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { createNewGroup, editGroupById } from '../../store/groups';

export default function GroupForm({formType, group={}}) {
  const history = useHistory();
  const dispatch = useDispatch();

  if (group.GroupImages) {
    group.url = group.GroupImages.find(image => image.preview).url;
  }

  const [city, setCity] = useState(group.city ?? '');
  const [state, setState] = useState(group.state ?? '');
  const [location, setLocation] = useState(city&&state ? `${group.city}, ${group.state}`: '');
  const [name, setName] = useState(group.name ?? '');
  const [about, setAbout] = useState(group.about ?? '');
  const [type, setType] = useState(group.type ?? '');
  const [isPrivate, setIsPrivate] = useState(group.private?.toString() ?? '');
  const [url, setUrl] = useState(group.url ?? '');
  const [errors, setErrors] = useState({});
  const [userSubmit, setUserSubmit] = useState(false);

  useEffect(() => {
    const [newCity, newState] = location.split(/,\s*/);
    setCity(newCity);
    setState(newState);
  }, [location])

  useEffect(() => {
    const err = {};
    if (!city) err.city="Location is required"
    if (!state) err.state="Location is required"
    if (!name || name.length > 60) err.name="Name is required"
    if (about.length < 50) err.about="Description must be at least 50 characters long"
    if (!type) err.type="Group Type is required"
    if (!isPrivate) err.private="Visibility Type is required"
    if (formType==="create"
        && !['.png', `.jpg`, `.jpeg`].find(end => url.endsWith(end))) {
        err.url="Image URL must end in .png, .jpg, or .jpeg"
    }

    setErrors(err)
  }, [city, state, name, about, type, isPrivate, url])

  async function handleSubmit(e) {
    e.preventDefault();
    setUserSubmit(true);

    const payload = {city, state, name, about, type, private: isPrivate};

    if (Object.values(errors).length) return;

    let thunk;
    if (formType==="create") {
        console.log("creating")
        thunk = createNewGroup;
        payload.url = url
    } else {
        console.log("editing")
        thunk = editGroupById;
        payload.groupId = group.id
    }

    try {
      const resGroup = await dispatch(thunk(payload))
    //   console.log("🚀 ~ file: index.js:69 ~ handleSubmit ~ resGroup:", resGroup)
      history.push(`/groups/${resGroup.id}`)
    } catch(e) {
    //   const newErrors = await e.json()
    //   setErrors(newErrors.errors);
        console.log(e)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{formType==="create" ? "Start a New Group" : "Update your Group"}</h1>
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
            {(errors.city||errors.state) && userSubmit && "Location is required"}
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
          <p>{errors.name && userSubmit && "Name is required and must be 60 characters or less"}</p>
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
          <p>{userSubmit && errors?.about}</p>
        </div>
      </section>
      <section>
        <h2>Final steps...</h2>
        <div>
          <label htmlFor="type">Is this an in-person or online group?</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="" disabled={!!type}>Choose an option</option>
            <option value="In person">In Person</option>
            <option value="Online">Online</option>
          </select>
          <div className='form-error'>
            <p>{errors.type && userSubmit && "Group Type is required"}</p>
          </div>
        </div>
        <div>
          <label htmlFor="private">Is this group private or public?</label>
          <select id="private" value={isPrivate} onChange={(e) => setIsPrivate(e.target.value)}>
            <option value="" disabled={!isPrivate.length}>Choose an option</option>
            <option value="true">Private</option>
            <option value="false">Public</option>
          </select>
          <div className='form-error'>
            <p>{errors.private && userSubmit && "Visibility Type is required"}</p>
          </div>
        </div>
        <div className={formType==="create" ? "" : "hidden"}>
          <label>Please add an image URL for your group below:</label>
          <input type="text" placeholder='Image Url' value={url} onChange={(e) => setUrl(e.target.value)} />
          <div className='form-error'>
            <p>{errors.url && userSubmit && "Image URL must end in .png, .jpg, or .jpeg"}</p>
          </div>
        </div>
      </section>
      <button>{formType==="create" ? "Create Group" : "Update Group"}</button>
    </form>
  )
}
