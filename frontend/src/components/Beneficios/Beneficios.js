import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import "./styles/beneficios.css";
import { getBeneficiosByCliente } from "../../services/beneficios.service";
import { useEffect, useState } from "react";
import { BeneficiosBox } from "./BeneficiosBox";
import { useAuth0 } from "@auth0/auth0-react";

export const Beneficios = () => {
  const [beneficios, setBeneficios] = useState([]);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    async function cargarBeneficios() {
      if (isAuthenticated && user && user.nickname) {
        try {
          const res = await getBeneficiosByCliente(user.nickname);
          console.log(res.data);
          setBeneficios(res.data);
        } catch (error) {
          console.error("Error al cargar beneficios:", error);
        }
      }
    }
    cargarBeneficios();
  }, [isAuthenticated, user]);

  return (
    <>
      <Header />
      <main>
        <header className="tituloBeneficios">
          <h1>Beneficios</h1>
        </header>
        <section className="allListaBeneficios">
          {console.log(beneficios.length)}
          {
            beneficios?.map((beneficio) => (
              <BeneficiosBox
                id={beneficio.id_beneficio}
                key={beneficio.id_beneficio}
                nombre={beneficio.nombre}
                foto={beneficio.imagen}
                descripcion={beneficio.descripcion}
                porcentajeDescuento={beneficio.porcentajeDescuento}
                codigoDescuento={beneficio.codigoDescuento}
                usado={beneficio.usado}
              />
            ))
          }
        </section>
      </main>
      <Footer />
    </>
  );
};
