import './App.css';
import CreateUserDialog from './Form';
import PrivateRoute from './PrivateRoute';
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

      </Switch>
    </Router>

  );
}

export default App;
