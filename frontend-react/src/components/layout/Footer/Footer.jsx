import React from "react";
import styles from "./Footer.module.css";

import logo from "../../../assets/images/LogoBlanco.png";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <img src={logo} alt="Logo ByPass" />
      <hr />
      <small className={styles.copyright}>
        <em>Copyright ByPass @2025. Todos los derechos reservados</em>
      </small>
    </footer>
  );
};
