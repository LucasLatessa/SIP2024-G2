import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "./AdmUsuarios.css";
import { getAllUsers, updateRole } from "../../../../services/usuarios.service";
import toast from "react-hot-toast";

function AdmUsuarios() {
  const [users, setUsers] = useState([]);
  const { usuario, role, photo } = useOutletContext();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
      }
    };

    fetchUsers();
  }, [role]);

  //Cambio de role
  // const handleRoleChange = async (userId, newRole) => {
  //   try {
  //     await updateRole(userId, newRole);
  //     // Actualizar la lista de usuarios después de cambiar el rol
  //     await fetchUsers();
  //   } catch (error) {
  //     console.error("Error al cambiar el rol del usuario:", error);
  //   }
  // };

  const handleRoleChange = async (id_event, newState) => {

    const procesoDeActualizacion = async () => {
      await updateRole(id_event, newState);
      await fetchUsers(); // Esperamos a que recargue la lista
    };

    // Notificacion
    toast.promise(procesoDeActualizacion(), {
      loading: "Actualizando usuario...",
      success: "Usario actualizado correctamente!",
      error: "No se pudo actualizar al usuario.",
    });
  };

  //Determino el rol a cambiar y ejecuto handleRoleChange
  const handleUserRoleChange = (userId, event) => {
    const newRole = event.target.value;
    console.log(userId);
    console.log(newRole);
    handleRoleChange(userId, newRole);
  };

  return (
    <>
      <article className="admUsuarios">
        <h1>Administracion de Usuarios</h1>
        <hr />
        <ul className="listaUsuarios">
          {users.map((user) => (
            <li className="usuario" key={user.user_id}>
              <span>{user.nickname}</span>

              <select
                value={user.rol}
                onChange={(e) => handleUserRoleChange(user.user_id, e)}
              >
                <option value="CLIENTE">CLIENTE</option>
                <option value="PRODUCTORA">PRODUCTORA</option>
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
              </select>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
}

export default AdmUsuarios;
