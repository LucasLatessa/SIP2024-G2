import styles from "./BeneficioCard.module.css";

export default function BeneficioCard({
  id,
  nombre,
  foto,
  descripcion,
  porcentajeDescuento,
  codigoDescuento,
  isProductora,
  onDelete,
  nombreEvento,
}) {
  return (
    <article className={styles.beneficio}>
      <h2 className={styles.beneficioTitle}>{nombre}</h2>
      <div className={styles.beneficioStructure}>
        <img src={foto} alt="Imagen del beneficio" />

        <div className={styles.datos}>
          {porcentajeDescuento !== null && (
            <h3 className={styles.beneficioDescuento}>
              -{porcentajeDescuento}%
            </h3>
          )}
          <h3 className={styles.beneficioCodigo}>Codigo: {codigoDescuento}</h3>
        </div>
      </div>
      {isProductora && (
        <button className="delete" onClick={() => onDelete(id)}>
          Eliminar
        </button>
      )}
      <p className={styles.beneficioDescription}>{descripcion}</p>
      <p className={styles.beneficioDe}>Beneficio de: {nombreEvento}</p>
    </article>
  );
}
