import './App.css';
import CreateUserDialog from './Form';
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
        <Route path="/register/:token" component={CreateUserDialog} />
      </Switch>
    </Router>

  );
}

export default App;
