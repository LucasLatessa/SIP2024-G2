import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import logo from "../../../assets/images/LogoBlanco.png";
import styles from "./Header.module.css";
import { Carrousel } from "../../Carrousel/Carrousel";

export const Header = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  /* ------ Logeo ------ */
  
  const handleLoginClick = () => {
    //navigate("/login")
    loginWithRedirect();
  };

  const handleProfileClick = () => {
    navigate("/perfil");
  };

  // Manejo de titulos
  const titles = {
    "/eventos": "Eventos",
    "/mercado": "Mercado",
    "/beneficios": "Beneficios",
  };
  const title = titles[location.pathname];

  return (
    <header className={styles.header}>
      <div className={styles.headerNavbar}>
        <h1 className={styles.logoHeader}>
          <NavLink to="/">
            {" "}
            <img src={logo} alt="ByPass" className={styles.logoImgHeader} />
          </NavLink>
        </h1>
        <nav className={styles.navHeader}>
          <li>
            <NavLink to="/eventos" className={({ isActive }) => isActive ? styles.activeLink : ""}>Eventos</NavLink>
          </li>
          <li>
            <NavLink to="/mercado" className={({ isActive }) => isActive ? styles.activeLink : ""}>Mercado</NavLink>
          </li>
          <li>
            <NavLink to="/beneficios" className={({ isActive }) => isActive ? styles.activeLink : ""}>Beneficios</NavLink>
          </li>
          <li>
            {!isAuthenticated && 
              <span className={styles.navHeaderLogin} onClick={handleLoginClick}>Login</span>
            }
            {isAuthenticated && (
              <div onClick={handleProfileClick} className={styles.loginAuth0}>
                <img
                  src={user.picture}
                  alt="Usuario"
                  className={styles.imgLoginAuth0}
                />
              </div>
            )}
          </li>
        </nav>
      </div>
      {title && (
        <div className={styles.headerTitle}>
          <h2>{title}</h2>
        </div>
      )}
      { // Carrusel
      (location.pathname == "/") 
        ? <Carrousel/> : ""
      }
    </header>
  );
};
