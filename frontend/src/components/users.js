import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

export const Users = () => {
  const { user, isAuthenticated } = useAuth0();
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();
  const validar = () => {
    const data = { informacion: { name: user.email } };

    axios.post('http://localhost:8000/usuarios/clientes/crear/', data)
      .then((response) => {
        setResponseMessage(`Dato enviado con éxito: ${JSON.stringify(response.data)}`);
        navigate('/');
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