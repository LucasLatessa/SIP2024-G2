import React, { useState, useEffect } from "react";
import { getAllUsers, updateRole } from "../../services/usuarios.service";

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredUsers = users.filter((user) =>
    user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-table-container">
      <h2 className="users-title">Gestión de Roles de Usuarios</h2>
      <input
        type="text"
        placeholder="Buscar por nickname"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="buscador"
      />
      <table className="tabla-eventos">
        <thead>
          <tr>
            <th>Nickname</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.user_id}>
              <td>{user.nickname}</td>
              <td>
                <select
                  value={user.rol}
                  onChange={(e) => handleUserRoleChange(user.user_id, e)}
                  className="rol-select"
                >
                  <option value="CLIENTE">CLIENTE</option>
                  <option value="PRODUCTORA">PRODUCTORA</option>
                  <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
