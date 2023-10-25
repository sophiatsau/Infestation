import React from 'react'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'

import './Landing.css';

export default function Landing() {
  const sessionUser = useSelector(state => state.session.user);

  const joinMeetup = () => {
    console.log('button clicked')
  }

  return (
    <>
    <section id="welcome-container">
        <div id="welcome-text">
            <h1>
                The pest platform— Where their house becomes <em>our</em> house
            </h1>
            <p>
                Whatever food you crave, from rotting banana to sink strainer spinach, there are thousands of cockroaches with the same cravings on Infestation! Events are happening every day— sign up to join the feast!
            </p>
        </div>
        <img className="welcome-image" src='./images/dancing-roach-rainbow.gif' alt="image of happy roach - could be you!"/>
    </section>
    <section id="intro-container">
        <h2>How Infestation Works</h2>
        <p>
            Discover new cupboards and drawers!
        </p>
        <p>
            Start a group to host events!
        </p>
    </section>
    <section id="features-container">
        <div className='features-div'>
            <i className="fa-solid fa-trash-can"></i>
            <Link to='/groups' className="feature-link">See all groups</Link>
            <p className="features-caption">Find roaches with similar taste in trash!</p>
        </div>
        <div className='features-div'>
            <i className="fa-solid fa-house-fire"></i>
            <Link to='/events' className="feature-link">Find an event</Link>
            <p className="features-caption">Don't miss out on the latest house parties!</p>
        </div>
        <div className='features-div'>
            <i className="fa-regular fa-lightbulb"></i>
            <Link to='/groups/new' className={sessionUser ? "feature-link" : 'disabled-link'}>Start a group</Link>
            <p className="features-caption">Got a proposal for a 2am pantry raid? We'd love to hear!</p>
        </div>
    </section>
    <section id="join-site-container" className={sessionUser ? "hidden" : ""}>
        <button id="join-site-button" onClick={joinMeetup}>Join Infestation!</button>
    </section>
    </>
  )
}
