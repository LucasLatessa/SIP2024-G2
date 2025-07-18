import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import "./styles/header.css";
import { Link } from "react-router-dom";

//Header del sitio
export const Header = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLoginClick = () => {
    loginWithRedirect();
  };

  const handleProfileClick = () => {
    navigate("/perfil");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header-principal">
      <h1 className="logoHeader">
        <Link to="/">
          <img
            src="/assets/LogoSinFondoBlanco.png"
            alt="ByPass"
            className="logo"
          />
        </Link>
      </h1>

      {/* Botón hamburguesa */}
      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>

      <nav className={`navegacion ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/eventos">Eventos</Link>
        </li>
        <li>
          <Link to="/mercado">Mercado</Link>
        </li>
        <li>
          <Link to="/beneficios">Beneficios</Link>
        </li>
        <li>
          {!isAuthenticated ? (
            <div className="login" onClick={handleLoginClick}>
              <img
                src="/assets/user.png"
                alt="Usuario"
                className="icono-usuario"
              />
            </div>
          ) : (
            <div className="profile" onClick={handleProfileClick}>
              <img
                src={user.picture}
                alt="Usuario"
                className="icono-usuario-auth0"
              />
            </div>
          )}
        </li>
      </nav>
    </header>
  );
};
