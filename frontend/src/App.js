import {Switch, Route} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import React, {useState, useEffect} from 'react';

import * as sessionActions from "./store/session";
import Navigation from './components/Navigation';
import Landing from './components/Landing';
import GroupsList from './components/GroupsList'
import GroupDetails from './components/GroupDetails';
import EventsList from './components/EventsList';
import EventDetails from './components/EventDetails';
import GroupCreationPage from './components/GroupCreationPage';
import GroupUpdatePage from './components/GroupUpdatePage';
import EventCreationPage from './components/EventCreationPage';
import PageNotFound from './components/PageNotFound'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    //chain .then on dispatch bc returning promise
    //don't load until confirm session status
    dispatch(sessionActions.restoreUser())
      .then(() => setIsLoaded(true));
  }, [dispatch])

  return (
    <>
    <Navigation isLoaded={isLoaded} />
    {isLoaded && (
      <div className='body-container'>
      <Switch>
        <Route exact path='/'>
          <Landing />
        </Route>
        <Route exact path='/groups'>
          <GroupsList />
        </Route>
        <Route exact path='/groups/new'>
          <GroupCreationPage />
        </Route>
        <Route exact path='/groups/:groupId/edit'>
          <GroupUpdatePage />
        </Route>
        <Route exact path='/groups/:groupId'>
          <GroupDetails />
        </Route>
        <Route exact path='/groups/:groupId/events/new'>
          <EventCreationPage />
        </Route>
        <Route exact path='/events/:eventId'>
          <EventDetails />
        </Route>
        <Route exact path='/events'>
          <EventsList />
        </Route>
        <Route exact path='/unauthorized'>
          You are not authorized to do that.
        </Route>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
      </div>
    )}
    </>
  );
}

export default App;
