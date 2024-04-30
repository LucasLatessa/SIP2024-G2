import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import "../styles/header.css";
import { Link } from "react-router-dom";

export const Header = () => {
  const { isAuthenticated } = useAuth0();
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const handleLoginClick = () => {
    loginWithRedirect();
  };
  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="header-principal">
      <h1>
        <Link to="/"><img src="assets/LogoSinFondoBlanco.png" alt="ByPass" className="logo"/></Link>
      </h1>
      <nav className="navegacion">
        <li><Link to="/eventos">Eventos</Link></li>
        <li><Link to="/mercado">Mercado</Link></li>
        <li><Link to="/beneficios">Beneficios</Link></li>
        <li>{!isAuthenticated && (
            <div className="login" onClick={handleLoginClick}>
              <img
                src="assets/user.png"
                alt="Usuario"
                className="icono-usuario"
              />
            </div>
        )}
        {isAuthenticated && (
            <div className="profile" onClick={handleProfileClick}>
              <img src="assets/user.png" alt="Usuario" className="icono-usuario" />
            </div>
        )}</li>
        
      </nav>
    </header>
  );
};
