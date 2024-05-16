import React, { useState, useEffect } from "react";
import { getAllUsers,getUserNick, updateRole } from "../services/usuarios.service";

export const UserList = ({ rol }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserRole, setSelectedUserRole] = useState("");
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
     } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateRole(userId, newRole);
      // Actualizar la lista de usuarios después de cambiar el rol
      await fetchUsers();
    } catch (error) {
      console.error("Error al cambiar el rol del usuario:", error);
    }
  };

  const handleUserRoleChange = (userId, event) => {
    const newRole = event.target.value;
    setSelectedUserId(userId);
    setSelectedUserRole(newRole);
    handleRoleChange(userId, newRole);
  };
  if (rol=="ADMINISTRADOR") {
    return (
    <div>
      <h2 className="users">Lista de Usuarios</h2>
      <ul>
        {users.map(user => (
          <li className="usuario" key={user.user_id}>
            {user.nombre} {user.apellido} -  
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
  );}else{
    return null;
  }
  
};