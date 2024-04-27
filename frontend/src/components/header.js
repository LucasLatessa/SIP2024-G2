//import { useHistory } from 'react-router-dom'; 
import React from "react";
import './header.css';
import { useAuth0 } from "@auth0/auth0-react";

export const Header = () => {
    const { isAuthenticated } = useAuth0();
    const { loginWithRedirect } = useAuth0();
    //const history = useHistory(); // Obtén el objeto history
    const handleLoginClick = () => {
        loginWithRedirect();
      };
    /* const handleProfileClick = () => {
        history.push('/profile'); // Redirige al usuario a la ruta '/profile'
    }; */
    return (
        <header class="header-principal">
        <h1>
        <a href="">
            <img src="/LogoSinFondoBlanco.png" alt="ByPass" class="logo" />
        </a>
        </h1>
        <a href=""
        >Eventos</a>
        <a href=""
        >Marketplace</a>
        <a href=""
        >Beneficios</a>
        {!isAuthenticated && (
        <>
            <div className="login" onClick={handleLoginClick}>
                <img src="/user.png" alt="Usuario" className="icono-usuario" />
            </div>
        </>
        )}
        {isAuthenticated && (
                <>
                    {/* <div className="profile" onClick={handleProfileClick}>
                        <img src="/user.png" alt="Usuario" className="icono-usuario" />
                    </div> */}
                </>
            )}
    </header>
    );
};



