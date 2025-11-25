import React from "react";
import { Link } from "react-router-dom";

import logo from "../../../assets/images/LogoBlanco.png";
import styles from "./Header.module.css"

export const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.logoHeader}>
        <Link to="/"> <img src={logo} alt="ByPass" className={styles.logoImgHeader} /></Link>
      </h1>
      <nav className={styles.navHeader}>
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
          {/**{!isAuthenticated && (
            <div className="login" onClick={handleLoginClick}>
              <img
                src="/assets/user.png"
                alt="Usuario"
                className="icono-usuario"
              />
            </div>
          )}
          {isAuthenticated && (
            <div className="profile" onClick={handleProfileClick}>
              <img
                src={user.picture}
                alt="Usuario"
                className="icono-usuario-auth0"
              />
            </div>
          )}**/}
          <Link to="/login">Login</Link>
        </li>
      </nav>
    </header>
  );
};
