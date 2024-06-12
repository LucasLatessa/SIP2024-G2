import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import "./styles/beneficios.css";
import { useEffect, useState } from "react";
import { BeneficiosBox } from "./BeneficiosBox";
import { getBeneficiosByProductora } from "../../services/beneficios.service";

export const BeneficiosProductora = ({usuario}) => {
  const [beneficios, setBeneficios] = useState([]);

  useEffect(() => {
    async function cargarBeneficios() {
        try {
          const res = await getBeneficiosByProductora(usuario.nickname);
          setBeneficios(res.data);
        } catch (error) {
          console.error("Error al cargar beneficios:", error);
        }
    }
    cargarBeneficios();
  }, []);

  return (
    <>
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
    </>
  );
};
