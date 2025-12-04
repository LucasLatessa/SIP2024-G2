import AccountInfo from "../../components/Profile/Common/AccountInfo/AccountInfo"
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserRole } from "../../utils/useUserRole"
import { useNavigate } from "react-router-dom";
import NavProfile from "../../components/Profile/NavProfile/NavProfile";
import {getUserNick} from "../../services/usuarios.service"

import styles from "./Profile.module.css";

export default function Profile(){
  const { user, logout, isAuthenticated } = useAuth0();
  const [usuarioData, setusuarioData] = useState(null);
  const role = useUserRole(usuarioData);

  //Traigo los datos del cliente cuando se renderiza el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserNick(user.nickname);
        setusuarioData(response.data.usuario);
      } catch (error)
        {
          console.error("Error al recuperar los datos del usuario:", error);
        }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, user?.nickname]);
  
  useEffect(() => {
    console.log(user);
  }, [user]);


  return (
    <main className={styles.profile}>
      <NavProfile usuario={usuarioData} role={role} />
      <AccountInfo usuario={usuarioData} photo={user?.picture} role={role} />
    </main>
  );
}