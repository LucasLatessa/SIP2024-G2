import React, { useState } from "react";
import "./styles/ayuda.css";

export const Ayuda = () => {
  const [comprarEntrada, setComprarEntrada] = useState(false);
  const [venderEntrada, setVenderEntrada] = useState(false);
  const [logearse, setLogearse] = useState(false);
  const [mercadopago, setmercadopago] = useState(false);
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
      <article className={`vender ${mercadopago ? 'active' : ''}`}>
        <button className="ayuda-boton" onClick={() => setmercadopago(!mercadopago)}>
          Vincular Cuenta MercadoPago
        </button>
        {mercadopago && (
          <ul className="merpago-list">
            <li className="merpago-1">En tu cuenta de MercadoPago, ve a "Configuración"
              <img className="ayuda-img"src="/assets/ayuda/Mercadopago1.png"width="400"/>
            </li>
            <li className="merpago-2">En el apartado "Gestión y administración", selecciona "Credenciales"
              <img className="ayuda-img"src="/assets/ayuda/Mercadopago2.png"/>
            </li>
            <li className="merpago-3">Completa los datos tal como se ve en el siguiente ejemplo:
              <img className="ayuda-img"src="/assets/ayuda/Mercadopago3.png"/>
            </li>
            <li className="merpago-4">Creaste tu aplicacion!
              <img className="ayuda-img"src="/assets/ayuda/Mercadopago4.png"width="400"  />
            </li>
            <li className="merpago-5">Activa tus credenciales
              <img className="ayuda-img"src="/assets/ayuda/Mercadopago5.png" />
            </li>
            <li className="merpago-6">Activar Credenciales de produccion, tal como se indica:
            <img className="ayuda-img"src="/assets/ayuda/Mercadopago6.png" />
            </li>
            <li className="merpago-7">Copiar Acces Token y Client Secret
              <img className="ayuda-img"src="/assets/ayuda/Mercadopago7.png" />
              <img className="ayuda-img"src="/assets/ayuda/Mercadopago8.png"width="600" height="120"  />
            </li>
            <li className="merpago-8">Logueate en nuestro sistema</li>
            <li className="merpago-9">En el perfil, selecciona a "Cuenta Mercadopago"</li>
            <li className="merpago-10">Pega los datos copiados en el paso 7</li>
            <li className="merpago-11">Presionar "Agregar Cuenta"</li>
            <li className="merpago-12">Listo, ya pueden vender entradas y se te acreditara el dinero correspondiente por la venta</li>
          </ul>
        )}
      </article>
    </main>
  );
};