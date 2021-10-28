import './App.css';
import CreateUserDialog from './Form';
import PrivateRoute from './PrivateRoute';
import GetMatrixToken from './GetMatrixToken';
import SetMatrixAccess from './SetMatrixAccess';
import Projects from './Projects';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

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
