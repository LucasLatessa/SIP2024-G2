import BeneficioCard from "../../components/Beneficios/BeneficioCard/BeneficioCard.jsx";

import { useEffect, useState } from "react";
import { getBeneficiosByCliente } from "../../services/beneficios.service";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserNick } from "../../services/usuarios.service";

import styles from "./Beneficios.module.css";

export default function Beneficios() {
  const [usuario, setUsuario] = useState(null);
  const { user, isAuthenticated } = useAuth0();
  const [beneficios, setBeneficios] = useState([]);

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

  useEffect(() => {
    if (!usuario?.nickname) return; // evita ejecutar si usuario aún no está cargado

    async function cargarBeneficios() {
      try {
        const res = await getBeneficiosByCliente(usuario.nickname);
        setBeneficios(res.data);
      } catch (error) {
        console.error("Error al cargar beneficios:", error);
      }
    }

    cargarBeneficios();
  }, [usuario]);

  useEffect(() => {
    console.log(usuario);
    console.log(beneficios);
  }, [beneficios]);

  return (
    <main>
      <section className={styles.listBeneficios}>
        {beneficios?.map((beneficio) => (
          <BeneficioCard
            id={beneficio.id_beneficio}
            key={beneficio.id_beneficio}
            nombre={beneficio.nombre}
            foto={beneficio.imagen}
            descripcion={beneficio.descripcion}
            porcentajeDescuento={beneficio.porcentajeDescuento}
            codigoDescuento={beneficio.codigoDescuento}
            usado={beneficio.usado}
            nombreEvento={beneficio.evento}
          />
        ))}
      </section>
    </main>
  );
}
