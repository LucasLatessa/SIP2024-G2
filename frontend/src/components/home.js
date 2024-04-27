import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Header } from './header';
import { Profile } from './profile';
import { LoginButton } from './buttons/loginButton';
import { SignupButton } from './buttons/signupButton';
import { LogoutButton } from './buttons/logoutButton';
export const Home = () => {
    const { isAuthenticated } = useAuth0();

    return (
        <div className="App">
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