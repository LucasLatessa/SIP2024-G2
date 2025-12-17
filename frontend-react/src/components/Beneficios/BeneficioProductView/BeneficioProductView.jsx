import React from "react";
import "./BeneficioProductView.css"

const BeneficioProductView = ({
  nombre,
  porcentaje,
  codigo,
  evento,
}) => {
  return (
    <article className="beneficioProductView">
      <header className="beneficioHeader">
        <h3 className="beneficioNombre">{nombre}</h3>
        <span className="beneficioPorcentaje">{porcentaje}%</span>
      </header>

      <section className="beneficioCodigo">
        <span>Código:</span>
        <strong>{codigo}</strong>
      </section>

      <footer className="beneficioEvento">
        <p>
          Evento asociado: <strong>{evento}</strong>
        </p>
      </footer>
    </article>
  );
};

export default BeneficioProductView;
