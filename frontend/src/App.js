import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './components/home';
import { LoginButton } from './components/buttons/loginButton';
import { LogoutButton } from './components/buttons/logoutButton';
import { SignupButton } from './components/buttons/signupButton';
import { Profile } from './components/profile';
/* 
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/profile" component={Profile} /> 
      </Switch>
    </Router>
  );
} */




function App() {
  return (
    <div className="App">
        <LoginButton/>
        <LogoutButton/>
        <SignupButton/>
        <Profile/>
      <Header />
      
      {!isAuthenticated && (
        <>
          <LoginButton />
          <SignupButton />
        </>
      )}
      {isAuthenticated && <LogoutButton />}
      <Profile isAuthenticated={isAuthenticated} />
    </div>
  );
} 

export default App;
