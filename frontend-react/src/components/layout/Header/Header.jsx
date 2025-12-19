import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import logo from "../../../assets/images/LogoBlanco.png";
import styles from "./Header.module.css";
import { Carrousel } from "../../Carrousel/Carrousel";
import toast from "react-hot-toast";

export const Header = () => {
  const { loginWithRedirect, isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();


  // ... dentro de tu componente
const [menuOpen, setMenuOpen] = useState(false); // 2. Estado del menú

const toggleMenu = () => {
  setMenuOpen(!menuOpen);
};

// Función para cerrar el menú al hacer click en un link
const closeMenu = () => {
    setMenuOpen(false);
}

  /* ------ Logeo ------ */
  
  const handleLoginClick = () => {
    //navigate("/login")
    loginWithRedirect();
  };

  const handleProfileClick = () => {
    navigate("/perfil");
  };

  useEffect(() => {
    // Esperamos a que Auth0 termine de cargar
    if (!isLoading && isAuthenticated) {
      
      // sessionStorage para que el cartel no salga cada vez que el usuario refresca la página 
      const yaSalude = sessionStorage.getItem('bienvenida_mostrada');

      if (!yaSalude) {
        toast.success(`¡Hola de nuevo, ${user?.nickname || user?.name}!`, {
            icon: '👋',
            duration: 4000
        });
        
        // Ya realizo el saludo en esta sesion
        sessionStorage.setItem('bienvenida_mostrada', 'true');
      }
    }
  }, [isAuthenticated, isLoading, user]);


  /* ------ Manejo de titulos ------ */
  const titles = {
    "/eventos": "Eventos",
    "/mercado": "Mercado",
    "/beneficios": "Beneficios",
    "/crear-evento": "Crear Evento",
    "/crear-beneficio": "Crear Beneficio"
  };
  const title = titles[location.pathname];

  return (
    <header className={styles.header}>
      <div className={styles.headerNavbar}>
        <h1 className={styles.logoHeader}>
          <NavLink to="/" onClick={closeMenu}> {/* Cierra al ir al home */}
            <img src={logo} alt="ByPass" className={styles.logoImgHeader} />
          </NavLink>
        </h1>

        {/* 3. Botón Hamburguesa (Solo visible en mobile por CSS) */}
        <div className={`${styles.hamburger} ${menuOpen ? styles.isActive : ''}`} onClick={toggleMenu}>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
        </div>

        {/* 4. Agregamos la clase condicional 'navActive' */}
        <nav className={`${styles.navHeader} ${menuOpen ? styles.navActive : ""}`}>
          <li>
            <NavLink 
                to="/eventos" 
                className={({ isActive }) => isActive ? styles.activeLink : ""}
                onClick={closeMenu} // Cierra al clickear
            >
                Eventos
            </NavLink>
          </li>
          <li>
            <NavLink 
                to="/mercado" 
                className={({ isActive }) => isActive ? styles.activeLink : ""}
                onClick={closeMenu}
            >
                Mercado
            </NavLink>
          </li>
          <li>
            <NavLink 
                to="/beneficios" 
                className={({ isActive }) => isActive ? styles.activeLink : ""}
                onClick={closeMenu}
            >
                Beneficios
            </NavLink>
          </li>
          <li>
            {!isAuthenticated && 
              <span className={styles.navHeaderLogin} onClick={() => { handleLoginClick(); closeMenu(); }}>Login</span>
            }
            {isAuthenticated && (
              <div onClick={() => { handleProfileClick(); closeMenu(); }} className={styles.loginAuth0}>
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
      
      {/* Resto del código (Título y Carrusel) igual... */}
      {title && (
        <div className={styles.headerTitle}>
          <h2>{title}</h2>
        </div>
      )}
      { (location.pathname == "/") ? <Carrousel/> : "" }
    </header>
);
};
