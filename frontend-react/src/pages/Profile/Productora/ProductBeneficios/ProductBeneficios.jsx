import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { deleteBeneficio, getBeneficiosByProductora } from "../../../../services/beneficios.service";
import "./ProductBeneficios.css";
import BeneficioProductView from "../../../../components/Beneficios/BeneficioProductView/BeneficioProductView";
import toast from "react-hot-toast";

function ProductBeneficios() {
  const [beneficios, setBeneficios] = useState([]);
  const { usuario, role, photo } = useOutletContext();

  useEffect(() => {
    const fetchBeneficios = async () => {
      try {
        //console.log(id)
        console.log(usuario);
        const response = await getBeneficiosByProductora(usuario.nickname);
        console.log(response.data);
        setBeneficios(response.data);
      } catch (error) {
        console.error(
          "Error al obtener la lista de beneficios de la productora"
        );
      }
    };

    fetchBeneficios();
  }, [role]);

  useEffect(() => {
    console.log(beneficios);
  }, [beneficios]);

  const handleDelete = async (id) => {

    const promesaEliminar = deleteBeneficio(id);

    try {
      await toast.promise(promesaEliminar, {
        loading: 'Eliminando beneficio...',
        success: '¡Beneficio eliminado correctamente!',
        error: 'No se pudo eliminar. Intente nuevamente.',
      });

      //Actualizo la vista
      setBeneficios((prevBeneficios) => 
        prevBeneficios.filter(beneficio => beneficio.id_beneficio !== id)
      );

    } catch (error) {
      console.error("Error al eliminar beneficio:", error);
    }
  }


  return (
    <>
      <article className="productBeneficios">
        <h1>Beneficios</h1>
        <hr />
        <section className="allListaBeneficiosProductora">
          {beneficios?.map((beneficio) => (
            <BeneficioProductView
              key={beneficio.id_beneficio}
              id={beneficio.id_beneficio}
              porcentaje={beneficio.porcentajeDescuento}
              nombre={beneficio.nombre}
              codigo={beneficio.codigoDescuento}
              evento={beneficio.evento}
              onDelete={handleDelete}
            />
          ))}
        </section>
        <Link className="crearBeneficioProductora" to="/crear-beneficio">
        Crear Beneficio
        </Link>
      </article>
    </>
  );
}

export default ProductBeneficios;
