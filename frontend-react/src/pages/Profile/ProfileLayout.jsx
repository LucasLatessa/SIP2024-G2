import AccountInfo from "../../components/Profile/Common/AccountInfo/AccountInfo";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserRole } from "../../utils/useUserRole";
import { useNavigate } from "react-router-dom";
import NavProfile from "../../components/Profile/NavProfile/NavProfile";
import { getUserNick } from "../../services/usuarios.service";
import { Outlet } from "react-router-dom";
import DataGuard from "../../components/DataGuards.jsx";

import styles from "./Profile.module.css";

export default function ProfileLayout() {
  const { user, logout, isAuthenticated } = useAuth0();
  const [usuarioData, setusuarioData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [loadingCliente, setLoadingCliente] = useState(true);
  const navigate = useNavigate();

  //Traigo los datos del cliente cuando se renderiza el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserNick(user.nickname);
        console.log(response.data);
        setusuarioData(response.data.usuario);
        setLoadingCliente(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          navigate("/terminos-condiciones");
        } else {
          console.error("Error al recuperar los datos del usuario:", error);
          setLoadingCliente(false);
        }
      } finally {
        setCargando(false);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, user?.nickname, navigate]);

  const role = useUserRole(usuarioData);

  return (
    <DataGuard cargando={cargando}>
      <main className={styles.profile}>
        {usuarioData && role ? (
          <>
            <NavProfile usuario={usuarioData} role={role} />

            {/*TODAS LAS PÁGINAS INTERNAS RECIBEN ESTOS DATOS */}
            <Outlet
              context={{ usuario: usuarioData, role, photo: user?.picture }}
            />
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </main>
    </DataGuard>
  );
}
