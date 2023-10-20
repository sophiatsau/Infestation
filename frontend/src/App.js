import {Switch, Route} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import React, {useState, useEffect} from 'react';

import * as sessionActions from "./store/session";
import Navigation from './components/Navigation';
// import LoginFormPage from './components/LoginFormPage';
import SignupFormPage from './components/SignupFormPage';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    //chain .then on dispatch bc returning promise
    dispatch(sessionActions.restoreUser())
      .then(() => setIsLoaded(true));
  }, [dispatch])

  return (
    <>
    <Navigation isLoaded={isLoaded} />
    {isLoaded && (
      <Switch>
        {/* <Route exact path='/login'>
          <LoginFormPage/>
        </Route> */}
        <Route exact path='/signup'>
          <SignupFormPage/>
        </Route>
        <Route>
          <h1>404 PAGE NOT FOUND</h1>
        </Route>
      </Switch>
    )}
    </>
  );
}

export default App;
