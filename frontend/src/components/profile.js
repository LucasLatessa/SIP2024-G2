import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "./buttons/logoutButton";
import "./styles/Profile.css";
import { UpdateProfileButton } from "./buttons/updateProfileButton";
import { updateCliente,updateAdministrador,updateProductora,getUser,crearCliente,getUserNick } from '../services/usuarios.service';
import { getAllTicketsByCli } from '../services/tickets.service';
import { getEvento } from '../services/eventos.service';
import { Header } from "./header-footer/header";
import { Footer } from "./header-footer/footer";
import { UserList } from "./UserList";
import { Tickets_profile } from "./Tickets_profile";

export const Profile = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [usuarioData, setusuarioData] = useState(null); 
  const [loadingCliente, setLoadingCliente] = useState(true);
  const [editingUserData, setEditingUserData] = useState(null);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState([]);
  

  const handleLoginClick = () => {
    loginWithRedirect();
  };
  const handleHome = () => {
    navigate('/');
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserNick(user.nickname);
        setusuarioData(response.data.usuario);
        setLoadingCliente(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          try {
            const userData = {
              nickname: user.nickname,
              nombre: user.given_name || '',
              apellido: user.family_name || '',
              correo: user.email || ''
            };
            await crearCliente(userData);
            const response = await getUserNick(user.nickname);
            setusuarioData(response.data.cliente);
            setLoadingCliente(false);
          } catch (error) {
            console.error('Error creando usuario:', error);
            setLoadingCliente(false);
          }
        } else {
          console.error('Error al recuperar los datos del usuario:', error);
          setLoadingCliente(false);
        }
      }
    };
  
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [ user?.nickname]);
  
  useEffect(() => {
    const cargarTickets = async () => {
      if (usuarioData && isAuthenticated) {
        try {
          const res = await getAllTicketsByCli(usuarioData.user_id);
          const ticketsConInfoCompleta = await Promise.all(res.data.tickets.map(async (ticket) => {
            const eventoRes = await getEvento(ticket.evento);
            return {
              precio: ticket.precioInicial,
              tipo_ticket: ticket.tipo_ticket,
              foto: eventoRes.data.imagen,
              eventoNombre: eventoRes.data.nombre,
              eventoFecha: eventoRes.data.fecha,
              eventoHora: eventoRes.data.hora
            };
          }));
          setTickets(ticketsConInfoCompleta);
        } catch (error) {
          console.error("Error al cargar los tickets:", error);
        }
      }
    };

    cargarTickets();
  }, [ usuarioData]);

  const handleUpdateProfile = async () => {
    try {
      let updateFunction;
      switch (usuarioData.rol) {
        case "CLIENTE":
          updateFunction = updateCliente;
          break;
        case "ADMINISTRADOR":
          updateFunction = updateAdministrador;
          break;
        case "PRODUCTORA":
          updateFunction = updateProductora;
          break;
        default:
          // Si el rol no está definido, muestra un error
          setError("Rol de usuario no reconocido");
          return;
      }
      // Ejecuta la función de actualización correspondiente
      await updateFunction(editingUserData);
      setusuarioData(editingUserData);
      setEditingUserData(null); 
      setError(null);
    } catch (error) {
      setError('Error al actualizar el perfil. El DNI que intenta ingresar ya existe.'); 
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUserData({ ...editingUserData, [name]: value });
  };

  if (isLoading || loadingCliente) {
    return (
      <div className="loading-container">
        <p className="noLogin">Usted no está logueado...</p>
        <button onClick={handleLoginClick}>Login</button>
    </div>
    );
  }

  return (
    isAuthenticated && (
      <main>
        <Header />
        <div className="datosContainer">
          <img src={user.picture} alt={user.name} />
          {usuarioData && (
            <div>
              <h2 className="infoCliente">Información del cliente </h2>
              <p className="datos">ID: {usuarioData.user_id}</p>
              <p className="datos">DNI: {usuarioData.dni} </p>
              <p className="datos">Nombre: {usuarioData.nombre}</p>
              <p className="datos">Apellido: {usuarioData.apellido}</p>
              <p className="datos">Nickname: {usuarioData.nickname}</p>
              <p className="datos">Correo: {usuarioData.correo}</p>
              <p className="datos">Rol: {usuarioData.rol}</p>
            </div>
          )}
          {editingUserData && (
            <div className="formulario-edicion">
              <h2>Editar perfil</h2>
              <label>
                DNI:
                <input
                  type="number"
                  name="dni"
                  value={editingUserData.dni || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre"
                  value={editingUserData.nombre || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Apellido:
                <input
                  type="text"
                  name="apellido"
                  value={editingUserData.apellido || ""}
                  onChange={handleInputChange}
                />
              </label>
              {error && <p className="error-message">{error}</p>}
              <button onClick={handleUpdateProfile}>Guardar cambios</button>
            </div>
          )}
          {!editingUserData && (
            <UpdateProfileButton
              onClick={() => setEditingUserData(usuarioData)}
            />
          )}

          <div className="botones-container">
            <button className="back" onClick={handleHome}>
              Volver
            </button>
            <LogoutButton />
          </div>
        </div>
        <Tickets_profile rol={usuarioData.rol} tickets={tickets}/>
        <UserList rol={usuarioData.rol} />
        <Footer />
      </main>
    )
  );
};

