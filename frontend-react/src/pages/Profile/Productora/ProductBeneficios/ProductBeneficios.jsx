import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { getBeneficiosByProductora } from "../../../../services/beneficios.service";
import "./ProductBeneficios.css";
import BeneficioProductView from "../../../../components/Beneficios/BeneficioProductView/BeneficioProductView";

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

  return (
    <>
      <article className="productBeneficios">
        <h1>Beneficios</h1>
        <hr />
        <section className="allListaBeneficiosProductora">
          {beneficios?.map((beneficio) => (
            <BeneficioProductView
              key={beneficio.id_beneficio}
              porcentaje={beneficio.porcentajeDescuento}
              nombre={beneficio.nombre}
              codigo={beneficio.codigoDescuento}
              evento={beneficio.evento}
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
