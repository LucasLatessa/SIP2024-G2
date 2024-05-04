import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "./buttons/logoutButton";
import "./styles/Profile.css";
import { UpdateProfileButton } from "./buttons/updateProfileButton";
import { updateUsuario,getUser,crearCliente,getUserNick } from '../services/usuarios.service';

export const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [clienteData, setClienteData] = useState(null); 
  const [loadingCliente, setLoadingCliente] = useState(true);
  const [editingUserData, setEditingUserData] = useState(null); // Nuevo estado para los datos en edición
  
  const handleHome = () => {
    navigate('/');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener los datos del usuario
        const response = await getUserNick(user.nickname);
        setClienteData(response.data.cliente);
        setLoadingCliente(false);
      } catch (error) {
        // Si el usuario no existe, crearlo
        if (error.response && error.response.status === 404) {
          try {
            const userData = {
              // Aquí puedes establecer los datos iniciales del usuario
              nickname: user.nickname,
              nombre: user.given_name || '',
              apellido: user.family_name || '',
              correo: user.email || ''
              // Agrega más campos según sea necesario
            };
            await crearCliente(userData);
            // Volver a intentar obtener los datos del usuario
            const response = await getUserNick(user.nickname);
            setClienteData(response.data.cliente);
            setLoadingCliente(false);
          } catch (error) {
            console.error('Error creating user:', error);
            setLoadingCliente(false);
          }
        } else {
          console.error('Error fetching user data:', error);
          setLoadingCliente(false);
        }
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, user?.nickname]);


  const handleUpdateProfile = async () => {
    try {
      await updateUsuario(editingUserData);
      setClienteData(editingUserData);
      setEditingUserData(null); 
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUserData({ ...editingUserData, [name]: value });
  };

  if (isLoading || loadingCliente) {
    return (
      <div>
        <p className="datos">Usted no esta logueado...</p>
        <button onClick={handleHome}>Volver</button>
      </div>
    );
  }

  return (
    isAuthenticated && (
      <div className="datosContainer">
        <img src={user.picture} alt={user.name} />
        {clienteData && (
          <div>
            <h2>Información del cliente </h2>
            <p className="datos">ID: {clienteData.user_id}</p>
            <p className="datos">DNI: {clienteData.dni}</p>
            <p className="datos">Nombre: {clienteData.nombre}</p>
            <p className="datos">Apellido: {clienteData.apellido}</p>
            <p className="datos">Nickname: {clienteData.nickname}</p>
            <p className="datos">Correo: {clienteData.correo}</p>
          </div>
        )}
        {editingUserData && (
          <div>
            <h2>Editar perfil</h2>
            <label>
              DNI:
              <input
                type="number"
                name="dni"
                value={editingUserData.dni || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Nombre:
              <input
                type="text"
                name="nombre"
                value={editingUserData.nombre || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Apellido:
              <input
                type="text"
                name="apellido"
                value={editingUserData.apellido || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Correo:
              <input
                type="email"
                name="correo"
                value={editingUserData.correo || ''}
                onChange={handleInputChange}
              />
            </label>
            <button onClick={handleUpdateProfile}>Guardar cambios</button>
          </div>
        )}
        {!editingUserData && (
          <UpdateProfileButton onClick={() => setEditingUserData(clienteData)} />
        )}
        <button onClick={handleHome}>Volver</button>
        <LogoutButton />
      </div>
    )
  );
};