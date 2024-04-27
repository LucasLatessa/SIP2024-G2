import React from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react'; // Importa el hook de autenticación de Auth0
import { LoginButton } from './components/buttons/loginButton';
import { LogoutButton } from './components/buttons/logoutButton';
import { SignupButton } from './components/buttons/signupButton';
import { Header } from './components/header';
import { Profile } from './components/profile';

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="App">
      <Header />
      {/* muestra el botón de inicio de sesion y registro si no esta autenticado */}
      {!isAuthenticated && (
        <>
          <LoginButton />
          <SignupButton />
        </>
      )}
      {/* muestra el botón de cierre de sesion solo si esta logueado */}
      {isAuthenticated && <LogoutButton />}
      {/* muestra el perfil */}
      <Profile isAuthenticated={isAuthenticated} />
    </div>
  );
}

export default App;
