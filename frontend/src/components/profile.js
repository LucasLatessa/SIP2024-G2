import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { UpdateProfileButton } from "./buttons/updateProfileButton";
import { LogoutButton } from "./buttons/logoutButton";
import "./styles/Profile.css"
export const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [clienteData, setClienteData] = useState(null); 
  const [loadingCliente, setLoadingCliente] = useState(true); 
  
  const handleHome = () => {
    navigate('/');
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`http://localhost:8000/usuarios/clientes/${user.nickname}/`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setClienteData(data.cliente);
          setLoadingCliente(false);
        })
        .catch(error => {
          console.error('Error fetching cliente data:', error);
        });
    }
  }, [isAuthenticated]);

  if (isLoading || loadingCliente) {
    return (<div><p className="datos">Usted no esta logueado...</p>
    <button onClick={handleHome}>Volver</button></div>);
  }

  return (
    isAuthenticated && (
      <div className="datosContainer">
      <img src={user.picture} alt={user.name} />
      {clienteData && (
        <div>
          <h2>Informacion del cliente </h2>
          <p className="datos">ID: {clienteData.user_id}</p>
          <p className="datos">DNI:
            <input
              type="number"
              value={clienteData.dni}
              onChange={(e) => setClienteData({ ...clienteData, dni: e.target.value })}
            />
          </p>
          <p className="datos">Nickname:
            <input
              type="text"
              value={clienteData.nickname}
              onChange={(e) => setClienteData({ ...clienteData, nickname: e.target.value })}
            />
          </p>
          <p className="datos">Nombre:
            <input
              type="text"
              value={clienteData.nombre}
              onChange={(e) => setClienteData({ ...clienteData, nombre: e.target.value })}
            />
          </p>
          <p className="datos">Apellido: 
            <input
              type="text"
              value={clienteData.apellido}
              onChange={(e) => setClienteData({ ...clienteData, apellido: e.target.value })}
            />
          </p>
          <p className="datos">Correo: 
            <input
              type="text"
              value={clienteData.correo}
              onChange={(e) => setClienteData({ ...clienteData, correo: e.target.value })}
            />
          </p>
          <p className="datos">Rol: {clienteData.rol}</p>
        </div>
      )}
      <div className="botones-container">
        <UpdateProfileButton />
        <button onClick={handleHome}>Volver</button>
        <LogoutButton />
      </div>
    </div>
    )
  );
};