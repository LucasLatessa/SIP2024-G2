import "./styles/beneficios.css";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserNick } from "../../services/usuarios.service";
import { BeneficiosCliente } from "./BeneficiosCliente";
import { BeneficiosProductora } from "./BeneficiosProductora";
import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";

export const Beneficios = () => {
  const [usuario, setUsuario] = useState(null);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    async function getUsuario() {
      if (isAuthenticated && user?.nickname) {
        try {
          const res = await getUserNick(user.nickname);
          setUsuario(res.data.usuario);
        } catch (error) {
          console.error("Error al obtener el usuario:", error);
        }
      }
    }
    getUsuario();
  }, [isAuthenticated, user?.nickname]);

  if (!isAuthenticated || !usuario) {
    return <div>Cargando...</div>;
  }

  let contenido;
  if (usuario.rol === 'CLIENTE') {
    contenido = <BeneficiosCliente usuario={user} />;
  } else if (usuario.rol === 'PRODUCTORA') {
    contenido = <BeneficiosProductora usuario={user} />;
  } else {
    contenido = <div>No tiene permisos para ver esta sección.</div>;
  }

  return (
    <>
      <Header />
      <main>
        {contenido}
      </main>
      <Footer />
    </>
  );
};
