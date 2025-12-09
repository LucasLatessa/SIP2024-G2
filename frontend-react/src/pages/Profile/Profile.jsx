import AccountInfo from "../../components/Profile/Common/AccountInfo/AccountInfo";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserRole } from "../../utils/useUserRole";
import { useNavigate } from "react-router-dom";
import NavProfile from "../../components/Profile/NavProfile/NavProfile";
import { getUserNick } from "../../services/usuarios.service";

import styles from "./Profile.module.css";

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth0();
  const [usuarioData, setusuarioData] = useState(null);

  //Traigo los datos del cliente cuando se renderiza el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserNick(user.nickname);
        console.log(response.data);
        setusuarioData(response.data.usuario);
      } catch (error) {
        console.error("Error al recuperar los datos del usuario:", error);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, user?.nickname]);

  const role = useUserRole(usuarioData);

  return (
        <main className={styles.profile}>
      {usuarioData && role ? (
        <>
          <NavProfile usuario={usuarioData} role={role} />
          <AccountInfo usuario={usuarioData} photo={user?.picture} role={role} />
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </main>
  );
}
