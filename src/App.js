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
        <Route exact  path="/register/:token" component={CreateUserDialog} />

        <PrivateRoute exact  path="/" component={Projects} />
        <Route exact  path="/getMatrixToken" component={GetMatrixToken} />
        <PrivateRoute exact  path="/setMatrixAccess" component={SetMatrixAccess} />

      </Switch>
    </Router>

  );
}

export default App;
