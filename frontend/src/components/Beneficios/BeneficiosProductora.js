import "./styles/beneficios.css";
import { useEffect, useState } from "react";
import { BeneficiosBox } from "./BeneficiosBox";
import { getBeneficiosByProductora } from "../../services/beneficios.service";
import { deleteBeneficio } from "../../services/beneficios.service";

const Modal = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // 2 segundos antes de recargar la página

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export const BeneficiosProductora = ({ usuario }) => {
  const [beneficios, setBeneficios] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
      setShowModal(true);
    } catch (error) {
      console.error("Error al eliminar beneficio:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.reload(); // Recarga la página
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
              nombreEvento={beneficio.evento}
            />
          ))}
        </section>
      </main>
      {showModal && <Modal message="Beneficio eliminado con éxito" onClose={handleCloseModal} />}
    </>
  );
};
