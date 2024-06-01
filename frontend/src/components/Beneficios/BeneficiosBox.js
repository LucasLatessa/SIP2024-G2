import "./styles/beneficiosBox.css";

//Encargado de contener como se van a mostrar los eventos dentro de la seccion
export const BeneficiosBox = ({
  nombre,
  foto,
  descripcion,
  porcentajeDescuento,
  codigoDescuento,
}) => {
  return (
    <article className="beneficio">
      <h2 className="nombre">{nombre}</h2>
      <img src={foto} alt="Imagen del beneficio" />
      <p className="descripcion">{descripcion}</p>
      {porcentajeDescuento !== null && (
        <h3 className="descuento">{porcentajeDescuento}%</h3>
      )}
      <h3 className="codigo">Codigo: {codigoDescuento}</h3>
    </article>
  );
};
