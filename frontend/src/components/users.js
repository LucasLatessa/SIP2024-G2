import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Users = () => {
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const data = { informacion: { name: "minombre" } };

    axios.post('http://localhost:8000/usuarios/clientes/crear/', data)
      .then((response) => {
        setResponseMessage(`Dato enviado con éxito: ${JSON.stringify(response.data)}`);
        // Redirigir después de un pequeño retraso para evitar re-montajes
        setTimeout(() => navigate('/'), 500); // Esto puede prevenir re-montajes
      })
      .catch((error) => {
        setResponseMessage(`Error al enviar el dato: ${error.message}`);
      });
  }, []); // Solo ejecuta una vez cuando el componente se monta

  return <h1>{responseMessage}</h1>;
};