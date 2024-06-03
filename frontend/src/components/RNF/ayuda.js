import React, { useState } from "react";
import "./styles/ayuda.css";

export const Ayuda = () => {
  const [comprarEntrada, setComprarEntrada] = useState(false);
  const [venderEntrada, setVenderEntrada] = useState(false);
  const [logearse, setLogearse] = useState(false);

  return (
    <main className="ayuda-main">
      <h2 className="titulo">Página de Ayuda</h2>

      <article className={`login ${logearse ? 'active' : ''}`}>
        <button className="ayuda-boton" onClick={() => setLogearse(!logearse)}>Logearse/Registrarse en nuestro sistema</button>
        {logearse && (
          <ul className="login-list">
            <li className="login-1">Clickear logo de usuario
              <img className="ayuda-img"src="/assets/ayuda/login1.png"/>
            </li>
            <li className="login-2">Ingresar con su cuenta
            </li>
            <li className="login-3">En caso de ser su primera vez en el sitio, aceptar los términos y condiciones
            <img className="ayuda-img"src="/assets/ayuda/login2.png"/>
            <img className="ayuda-img"src="/assets/ayuda/login3.png"/></li>
            <li className="login-4">Listo, ya esta logueado en ByPass</li>
          </ul>
        )}
      </article>
      <article className={`comprar ${comprarEntrada ? 'active' : ''}`}>
        <button className="ayuda-boton" onClick={() => setComprarEntrada(!comprarEntrada)}>
          Comprar una entrada
        </button>
        {comprarEntrada && (
          <ul className="comprar-list">
            <li className="comprar-1">Logueate en nuestro sistema</li>
            <li className="comprar-2">Eleji tu evento favorito</li>
            <li className="comprar-3">Seleccionar tipo de entrada y cantidad</li>
            <li className="comprar-4">Clickear Comprar (redirige a MercadoPago)</li>
            <li className="comprar-5">Listo, ya tenes tu entrada (la podes ver en el perfil)</li>
          </ul>
        )}
      </article>
      <article className={`vender ${venderEntrada ? 'active' : ''}`}>
        <button className="ayuda-boton" onClick={() => setVenderEntrada(!venderEntrada)}>
          Vender una entrada en el Mercado
        </button>
        {venderEntrada && (
          <ul className="vender-list">
            <li className="comprar-1">Logueate en nuestro sistema</li>
            <li className="comprar-2">En el perfil, dirigite a "Tus tickets"</li>
            <li className="comprar-3">En la entrada que desea vender, seleccione "Vender"</li>
            <li className="comprar-4">Completar el precio y presionar "Publicar"</li>
            <li className="comprar-5">Listo, ya pueden comprar tu entrada (la podes ver en el mercado)</li>
          </ul>
        )}
      </article>
    </main>
  );
};