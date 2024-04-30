import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import './header.css';
import { Link } from 'react-router-dom';

export const Header = () => {
    const { isAuthenticated } = useAuth0();
    const { loginWithRedirect } = useAuth0();
    const navigate = useNavigate();
    const handleLoginClick = () => {
        loginWithRedirect();
      };
    const handleProfileClick = () => {
        navigate('/perfil'); 
    };
    return (
        <header class="header-principal">
        <h1>
        <a href="#">
            <img src="../../LogoSinFondoBlanco.png" alt="ByPass" class="logo" />
        </a>
        </h1>
        <Link to="/eventos">Eventos</Link>
        <Link to="/mercado">Mercado</Link>
        <Link to="/beneficios">Beneficios</Link>
        {!isAuthenticated && (
        <>
            <div className="login" onClick={handleLoginClick}>
                <img src="../../user.png" alt="Usuario" className="icono-usuario" />
            </div>
        </>
        )}
        {isAuthenticated && (
                <>
                     <div className="perfil" onClick={handleProfileClick}>
                        <img src="/user.png" alt="Usuario" className="icono-usuario" />
                    </div> 
                </>
            )}
    </header>
    );
};




