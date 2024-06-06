import React, { useState, useEffect } from "react";
import { getAllUsers, updateRole } from "../../services/usuarios.service";

//Solo para vista de administrador, para el manejo de usuarios en el sistema
export const UserList = () => {
  const [users, setUsers] = useState([]);

  //Traigo todos los usuarios solamente si es un administrador
  useEffect(() => {
      fetchUsers();
  }, []);

  //Traigo todos los usuarios
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
    }
  };

  //Cambio de role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateRole(userId, newRole);
      // Actualizar la lista de usuarios después de cambiar el rol
      await fetchUsers();
    } catch (error) {
      console.error("Error al cambiar el rol del usuario:", error);
    }
  };

  //Determino el rol a cambiar y ejecuto handleRoleChange
  const handleUserRoleChange = (userId, event) => {
    const newRole = event.target.value;
    handleRoleChange(userId, newRole);
  };

  //Solamente si es administrador muestro
    return (
      <div>
        <h2 className="users">Lista de Usuarios</h2>
        <ul>
          {users.map((user) => (
            <li className="usuario" key={user.user_id}>
              {user.nickname} -
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
      </div>
    );
  
};
