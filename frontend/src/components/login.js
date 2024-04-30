import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

export const Login = () => {
  const { user, isAuthenticated } = useAuth0();
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();
  const validar = () => {
    const data = {
      informacion: {
        //user_id: null, // No se puede obtener de Auth0 directamente
        nickname: user.nickname, // Proporcionado por Auth0
        nombre: user.given_name, // Proporcionado por Auth0
        apellido: user.family_name, // Proporcionado por Auth0
        correo: user.email, // Proporcionado por Auth0
        //creacion: null, // No se puede obtener de Auth0 directamente
        //rol: null, // No se puede obtener de Auth0 directamente
      }
    };

    axios.post('http://localhost:8000/usuarios/clientes/create/', data)
      .then((response) => {
        setResponseMessage(`Dato enviado con éxito: ${JSON.stringify(response.data)}`);
        navigate('/perfil');
      })
      .catch((error) => {
        setResponseMessage(`Error al enviar el dato: ${error.message}`);
      });
  };
  useEffect(() => {
    if (isAuthenticated) {
      validar();
    }
  }, [isAuthenticated]); // Ejecutar cuando isAuthenticated cambie

  return (
    <div>
      <p>{responseMessage}</p>
    </div>
  );
};