import "./styles/beneficiosBox.css";

// Encargado de contener como se van a mostrar los eventos dentro de la seccion
export const BeneficiosBox = ({
  id,
  nombre,
  foto,
  descripcion,
  porcentajeDescuento,
  codigoDescuento,
  isProductora,
  onDelete,
  nombreEvento
}) => {
  return (
    <article className="beneficio">
      <h2 className="nombre">{nombre}</h2>
      <img className="imagen" src={foto} alt="Imagen del beneficio" />
      <p className="descripcion">{descripcion}</p>
      {porcentajeDescuento !== null && (
        <h3 className="descuento">{porcentajeDescuento}%</h3>
      )}
      <h3 className="codigo">Codigo: {codigoDescuento}</h3>
      {isProductora && <button className="delete" onClick={() => onDelete(id)}>Eliminar</button>}
      <p>Beneficio de: {nombreEvento}</p>
    </article>
  );
};

