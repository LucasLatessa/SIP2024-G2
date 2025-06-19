import "./styles/beneficios.css";
import { getBeneficiosByCliente } from "../../services/beneficios.service";
import { useEffect, useState } from "react";
import { BeneficiosBox } from "./BeneficiosBox";

export const BeneficiosCliente = ({usuario}) => {
  const [beneficios, setBeneficios] = useState([]);
  
  useEffect(() => {
    async function cargarBeneficios() {
        try {
          const res = await getBeneficiosByCliente(usuario.nickname);
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
        <section className="allListaBeneficios">
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
                nombreEvento={beneficio.evento}
              />
            ))
          }
        </section>
      </main>
    </>
  );
};
