import React from "react";
import "./BeneficioProductView.css"

const BeneficioProductView = ({
  id,
  nombre,
  porcentaje,
  codigo,
  evento,
  onDelete
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

      <button className="beneficioEliminar" onClick={() => onDelete(id)}>Eliminar</button>
    </article>
  );
};

export default BeneficioProductView;
