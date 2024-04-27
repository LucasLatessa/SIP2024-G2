import React from "react";
import './header.css';

export const Header = () => {
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
    <a href=""
      ><img src="/user.png" alt="Usuario" class="icono-usuario"
    /></a>
  </header>
  );
};



