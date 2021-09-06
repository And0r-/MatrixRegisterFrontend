import './App.css';
import CreateUserDialog from './Form';
import RegisterDone from './RegisterDone';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/register/:token" component={CreateUserDialog}>
          
        </Route>
        <Route path="/done">
          <RegisterDone />
        </Route>
        <Route path="/">
          
        </Route>
      </Switch>
    </Router>

  );
}

export default App;
