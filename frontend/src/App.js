import {Switch, Route} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import React, {useState, useEffect} from 'react';

import LoginFormPage from './components/LoginFormPage';
import * as sessionActions from "./store/session";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    //chain .then on dispatch bc returning promise
    dispatch(sessionActions.restoreUser())
      .then(() => setIsLoaded(true));
  }, [dispatch])

  return (
    isLoaded && (
      <Switch>
        <Route exact path='/login'>
          <LoginFormPage/>
        </Route>
        <Route>
          <h1>404 PAGE NOT FOUND</h1>
        </Route>
      </Switch>
    )
  );
}

export default App;
