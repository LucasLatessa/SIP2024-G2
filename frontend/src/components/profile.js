import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { UpdateProfileButton } from "./buttons/updateProfileButton";
import { LogoutButton } from "./buttons/logoutButton";

export const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  // Estados para  campos editables
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const handleUpdateProfile = () => {
    // aca van las actualizaciones a la db cuando actualizamos cliente
  };
  const handleHome  = () => {
    navigate('/'); 
  };
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        {/* ACA VER COMO HACER YA QUE EL USUARIO DEL AUTH0 NO TIENE DNI Y APELLIDO Y NOMBRE
        ESTA TODO JUNTO EN NAME (lucas-comment: para mi cuando hay alta de usuario por auth0 crear un usuario(db)  
         y aca usariamos ese usuario de nuestra db) */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <UpdateProfileButton onClick={handleUpdateProfile} />
        <button onClick={handleHome}>Volver</button>
        <LogoutButton/>
      </div>
    )
  );
};
