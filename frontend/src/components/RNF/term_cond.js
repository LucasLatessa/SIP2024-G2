import React, { useState } from "react";
import "../Profile/styles/Profile.css";
import { useAuth0 } from "@auth0/auth0-react";
import { crearUsuario } from "../../services/usuarios.service";
import { useNavigate } from "react-router-dom";

//Terminos y condiciones a la hora de registtrase
export const TermsAndConditions = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [role, setRole] = useState("");

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleCreateAccount = async () => {
    if (!termsAccepted) {
      alert("Debe aceptar los términos y condiciones para crear una cuenta.");
      return;
    }
    try {
      const userData = {
        nickname: user.nickname,
        nombre: user.given_name || "",
        apellido: user.family_name || "",
        correo: user.email || "",
        rol: role,
      };
      await crearUsuario(userData);
      //await fetchUserData();
    } catch (error) {
      console.error("Error creando usuario:", error);
    }
    navigate("/perfil");
  };

  return (
    <div className="container-terms">
      <h1 className="title_terms">Términos y Condiciones</h1>
      <article className="terms">
        <p>
          Al utilizar nuestro sitio web y servicios de venta y reventa de
          tickets, usted acepta cumplir y estar sujeto a los siguientes Términos
          y Condiciones. Si no está de acuerdo con estos términos, no utilice
          nuestro sitio web ni nuestros servicios.
        </p>
        <p>
          <strong>1. Aceptación de Términos</strong>
          <br />
          Al acceder y utilizar nuestro sitio web, usted acepta estar sujeto a
          estos Términos y Condiciones y a cumplir con todas las leyes y
          regulaciones aplicables.
        </p>
        <p>
          <strong>2. Descripción del Servicio</strong>
          <br />
          Ofrecemos una plataforma en línea para la venta y reventa de tickets
          para diversos eventos. Los usuarios pueden comprar y revender tickets
          a través de nuestra plataforma.
        </p>
        <p>
          <strong>3. Registro de Usuario</strong>
          <br />
          Para utilizar nuestros servicios, los usuarios deben registrarse
          proporcionando información precisa, completa y actualizada. Usted es
          responsable de mantener la confidencialidad de su cuenta y contraseña.
        </p>
        <p>
          <strong>4. Compra de Tickets</strong>
          <br />
          Todas las compras de tickets son definitivas y no reembolsables,
          excepto en los casos descritos en nuestra política de reembolsos.
        </p>
        <p>
          <strong>5. Reventa de Tickets</strong>
          <br />
          Los usuarios pueden revender tickets adquiridos a través de nuestra
          plataforma. La reventa debe cumplir con todas las leyes aplicables y
          nuestras políticas.
        </p>
        <p>
          <strong>6. Conducta del Usuario</strong>
          <br />
          Usted acepta no utilizar nuestro sitio web para propósitos ilegales o
          prohibidos por estos Términos y Condiciones. Está prohibido publicar
          contenido ofensivo, difamatorio o que infrinja derechos de terceros.
        </p>
        <p>
          <strong>7. Propiedad Intelectual</strong>
          <br />
          Todo el contenido y materiales disponibles en nuestro sitio web,
          incluyendo pero no limitado a textos, gráficos, logotipos, y software,
          son propiedad de la empresa y están protegidos por las leyes de
          propiedad intelectual.
        </p>
        <p>
          <strong>8. Limitación de Responsabilidad</strong>
          <br />
          No seremos responsables por ningún daño directo, indirecto, incidental
          o consecuente que resulte del uso o la imposibilidad de uso de nuestro
          sitio web o servicios.
        </p>
        <p>
          <strong>9. Modificaciones a los Términos</strong>
          <br />
          Nos reservamos el derecho de modificar estos Términos y Condiciones en
          cualquier momento. Cualquier cambio será efectivo inmediatamente
          después de su publicación en nuestro sitio web.
        </p>
        <p>
          <strong>10. Ley Aplicable</strong>
          <br />
          Estos Términos y Condiciones se regirán e interpretarán de acuerdo con
          las leyes del país en el que operamos, sin dar efecto a ningún
          principio de conflictos de leyes.
        </p>
        <p>
          <strong>11. Contacto</strong>
          <br />
          Si tiene alguna pregunta sobre estos Términos y Condiciones, puede
          contactarnos a través de la información de contacto proporcionada en
          nuestro sitio web.
        </p>
      </article>
      <label>
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={handleCheckboxChange}
        />
        Acepto los Términos y Condiciones
      </label>
      <fieldset>
        <legend>Seleccione su rol:</legend>
        <div>
          <label>
            <input
              type="radio"
              value="productora"
              checked={role === "productora"}
              onChange={handleRoleChange}
            />
            Productora
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="cliente"
              checked={role === "cliente"}
              onChange={handleRoleChange}
            />
            Cliente
          </label>
        </div>
      </fieldset>
      <button onClick={handleCreateAccount}>Crear Cuenta</button>
    </div>
  );
};
