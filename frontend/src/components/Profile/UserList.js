import React, { useState, useEffect } from "react";
import { getAllUsers, updateRole } from "../../services/usuarios.service";

export const UserList = () => {
  const [users, setUsers] = useState([]);

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
      await fetchUsers();
    } catch (error) {
      console.error("Error al cambiar el rol del usuario:", error);
    }
  };

  const handleUserRoleChange = (userId, event) => {
    const newRole = event.target.value;
    handleRoleChange(userId, newRole);
  };

  return (
    <div className="usuarios-admin-container">
      <h2 className="users-title">Gestión de Roles de Usuarios</h2>
      <div className="user-cards">
        {users.map((user) => (
          <div key={user.user_id} className={`user-card rol-${user.rol.toLowerCase()}`}>
            <h3 className="user-nickname">{user.nickname}</h3>
            <label className="rol-label">
              Rol:
              <select
                className="rol-select"
                value={user.rol}
                onChange={(e) => handleUserRoleChange(user.user_id, e)}
              >
                <option value="CLIENTE">CLIENTE</option>
                <option value="PRODUCTORA">PRODUCTORA</option>
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
              </select>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
