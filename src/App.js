import './App.css';
import CreateUserDialog from './Form';
// import Secured from './Secured';
import PrivateRoute from './PrivateRoute';
// import Secured2 from './Secured2';
import GetMatrixToken from './GetMatrixToken';
import SetMatrixAccess from './SetMatrixAccess';
import Projects from './Projects';
// import { ReactKeycloakProvider } from '@react-keycloak/web'
// import keycloak from './keycloak'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

// import { PrivateRoute } from './PrivateRoute'


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/register/:token" component={CreateUserDialog} />

        <PrivateRoute path="/projects" component={Projects} />
        <PrivateRoute path="/getMatrixToken" component={GetMatrixToken} />
        <PrivateRoute path="/setMatrixAccess" component={SetMatrixAccess} />

      </Switch>
    </Router>

  );
}

export default App;
