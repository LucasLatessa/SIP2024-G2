import './App.css';
import { LoginButton } from './components/buttons/loginButton';
import { LogoutButton } from './components/buttons/logoutButton';
import { SignupButton } from './components/buttons/signupButton';
import { Profile } from './components/profile';

function App() {
  return (
    <div className="App">
        <LoginButton/>
        <LogoutButton/>
        <SignupButton/>
        <Profile/>
    </div>
  );
}

export default App;
