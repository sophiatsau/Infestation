import {Switch, Route} from 'react-router-dom';

import LoginFormPage from './components/LoginFormPage'

function App() {
  return (
    <>
    <Switch>
      <Route exact path='/login'>
        <LoginFormPage/>
      </Route>
      <Route>
        <h1>404 PAGE NOT FOUND</h1>
      </Route>
    </Switch>
    </>
  );
}

export default App;
