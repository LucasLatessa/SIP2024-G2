import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/Profile.css";
import {
  updateCliente,
  updateAdministrador,
  updateProductora,
  getUserNick,
} from "../../services/usuarios.service";
import { UpdateProfileButton } from "./updateProfileButton";
import { LogoutButton } from "./logoutButton";
import { TicketsProfile  } from "./TicketsProfile";
import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { UserList } from "./UserList";
import { EventsList } from "./EventsList";
import { ProductoraView } from "./ProductoraView";

//Perfil de los usuarios
export const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [usuarioData, setusuarioData] = useState(null);
  const [loadingCliente, setLoadingCliente] = useState(true);
  const [editingUserData, setEditingUserData] = useState(null);
  const [error, setError] = useState(null);

  // const handleLoginClick = () => {
  //   loginWithRedirect();
  // };

  //Boton que me lleva al Home
  const handleHome = () => {
    navigate("/");
  };

  //Traigo los datos del cliente cuando se renderiza el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserNick(user.nickname);
        setusuarioData(response.data.usuario);
        setLoadingCliente(false);
      } catch (error) {
        //Si no esta registrado
        if (error.response && error.response.status === 404) {
          navigate("/terminos_condiciones");
        } else {
          console.error("Error al recuperar los datos del usuario:", error);
          setLoadingCliente(false);
        }
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, user?.nickname, navigate]);

  //Actualizo los datos del cliente
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
          // Si el rol no esta definido, muestra un error
          setError("Rol de usuario no reconocido");
          return;
      }
      // Ejecuta la funcion de actualización correspondiente
      await updateFunction(editingUserData);
      setusuarioData(editingUserData);
      setEditingUserData(null);
      setError(null);
    } catch (error) {
      setError(
        "Error al actualizar el perfil. El DNI que intenta ingresar ya existe."
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUserData({ ...editingUserData, [name]: value });
  };

  if (loadingCliente) {
    return (
      <div className="loading-container">
        <p className="chargeClient">Cargando datos del usuario...</p>
      </div>
    );
  }

  return (
    <main>
      <Header />
      <div className="datosContainer">
        <img src={user.picture} alt={user.name} />
        {usuarioData && (
          <div>
            <h2 className="infoClienteProfile">
              Información del {usuarioData.rol.toLowerCase()}{" "}
            </h2>
            <p className="datos">ID: {usuarioData.user_id}</p>
            <p className="datos">DNI: {usuarioData.dni} </p>
            <p className="datos">Nombre: {usuarioData.nombre}</p>
            <p className="datos">Apellido: {usuarioData.apellido}</p>
            <p className="datos">Nickname: {usuarioData.nickname}</p>
            <p className="datos">Correo: {usuarioData.correo}</p>
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
      <TicketsProfile  rol={usuarioData.rol} user_id={usuarioData.user_id} />
      <UserList rol={usuarioData.rol} />
      <ProductoraView rol={usuarioData.rol} id={usuarioData.user_id} />
      <EventsList rol={usuarioData.rol} />
      <Footer />
    </main>
  );
};
