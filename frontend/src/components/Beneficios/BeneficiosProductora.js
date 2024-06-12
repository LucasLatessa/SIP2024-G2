import "./styles/beneficios.css";
import { useEffect, useState } from "react";
import { BeneficiosBox } from "./BeneficiosBox";
import { getBeneficiosByProductora } from "../../services/beneficios.service";
import { deleteBeneficio } from "../../services/beneficios.service";

export const BeneficiosProductora = ({ usuario }) => {
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
  }, [usuario.nickname]);

  const handleDelete = async (id) => {
    try {
      await deleteBeneficio(id); // Llama a la función deleteBeneficio de tu archivo de servicios
      setBeneficios(beneficios.filter(beneficio => beneficio.id_beneficio !== id));
      console.log('Beneficio eliminado correctamente');
      alert('Beneficio eliminado con éxito');
    } catch (error) {
      console.error("Error al eliminar beneficio:", error);
    }
  };

  const isProductora = true;
  return (
    <>
      <main>
        <header className="tituloBeneficios">
          <h1>Beneficios</h1>
        </header>
        <section className="allListaBeneficios">
          {beneficios?.map((beneficio) => (
            <BeneficiosBox
              id={beneficio.id_beneficio}
              key={beneficio.id_beneficio}
              nombre={beneficio.nombre}
              foto={beneficio.imagen}
              descripcion={beneficio.descripcion}
              porcentajeDescuento={beneficio.porcentajeDescuento}
              codigoDescuento={beneficio.codigoDescuento}
              usado={beneficio.usado}
              isProductora={isProductora}
              onDelete={handleDelete}
            />
          ))}
        </section>
      </main>
    </>
  );
};
