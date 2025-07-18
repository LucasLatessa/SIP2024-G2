import React, { useState, useEffect } from "react";
import { getAllUsers, updateRole } from "../../services/usuarios.service";
import { useAuth0 } from "@auth0/auth0-react";

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3; // Cantidad fija de usuarios por página

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });
      const response = await getAllUsers(token);
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

  // Cálculo de paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="admin-table-container">
      <h2 className="users-title">Gestión de Roles de Usuarios</h2>

      <input
        type="text"
        placeholder="Buscar por nickname"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reiniciar página al buscar
        }}
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
          {currentUsers.map((user) => (
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

      {/* Paginación */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
