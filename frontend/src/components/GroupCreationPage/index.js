import React from 'react'

export default function GroupCreationPage() {
  return (
    <form>
      <h1>Start a New Group</h1>
      <section>
        <h2>Set your group's location</h2>
        <p>Infestation groups meet locally, in person, and online. We'll connect you with insects in your area.</p>
        <input type="text" placeholder='City, STATE' />
      </section>
      <section>
        <h2>What will your group's name be?</h2>
        <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
        <input type="text" placeholder='What is your group name?' />
      </section>
      <section>
        <h2>Describe the purpose of your group.</h2>
        <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
        <ol>
          <li>What's the purpose of the group?</li>
          <li>Who should join?</li>
          <li>What will you do at your events?</li>
        </ol>
        <textarea placeholder='Please write at least 30 characters' />
      </section>
      <section>
        <h2>Final steps...</h2>
        <div>
          <label htmlFor="type">Is this an in-person or online group?</label>
          <select id="type">
            <option value="In person">In Person</option>
            <option value="Online">Online</option>
          </select>
        </div>
        <div>
          <label htmlFor="private">Is this group private or public?</label>
          <select id="private">
            <option value="true">Private</option>
            <option value="false">Public</option>
          </select>
        </div>
        <div>
          <label>Please add an image URL for your group below:</label>
          <input type="text" placeholder='Image Url'/>
        </div>
      </section>
      <button>Create Group</button>
    </form>
  )
}
