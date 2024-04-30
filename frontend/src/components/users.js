import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

export const Users = () => {
    const { user } = useAuth0();
    const [inputData, setInputData] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const navigate = useNavigate();
    // const [name, setName] = useState(user.name);
    // const [email, setEmail] = useState(user.email);
    // const [user_id, setId] = useState(user.sub);
    // const [nickname, setNickname] = useState(user.nickname);

    useEffect(() => {
      // Se ejecuta cuando el componente se monta
    //   const data = {
    //     name: user.name,
    //     email: user.email,
    //     user_id: user.sub,
    //     nickname: user.nickname,
    // };
        const data = {
            name: "minombre"
        }

    axios.post('http://127.0.0.1:8000/usuarios/clientes/crear/', data) 
    .then((response) => {
        setResponseMessage('Dato enviado con éxito:', response.data);
    })
    .catch((error) => {
        setResponseMessage('Error al enviar el dato:', error);
    });

    //navigate('/'); 
    }, []); // Se ejecuta una vez, cuando se monta
  
    return <h1>{responseMessage}</h1>; // O un mensaje si quieres mostrar algo antes de redirigir
  };
