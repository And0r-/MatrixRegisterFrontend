import './App.css';
import CreateUserDialog from './Form';
import Secured from './Secured';
import Secured2 from './Secured2';
import GetMatrixToken from './GetMatrixToken';
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
        <Route path="/secured" component={Secured} />
        <Route path="/secured2" component={Secured2} />
        <Route path="/getMatrixToken" component={GetMatrixToken} />
      </Switch>
    </Router>

  );
}

export default App;
