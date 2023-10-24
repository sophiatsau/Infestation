import {Switch, Route} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import React, {useState, useEffect} from 'react';

import * as sessionActions from "./store/session";
import Navigation from './components/Navigation';
import Landing from './components/Landing';
import GroupsList from './components/GroupsList'
import GroupDetails from './components/GroupDetails';

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
        <Route exact path='/groups/:groupId'>
          <GroupDetails />
        </Route>
        <Route>
          <h1>404 PAGE NOT FOUND</h1>
        </Route>
      </Switch>
      </div>
    )}
    </>
  );
}

export default App;
