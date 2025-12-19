import {Spinner} from "./Spinner/Spinner";

export default function DataGuard({ cargando, children }) {

  // Si está cargando, muestra el spinner y MATA la renderización de los hijos
  if (cargando) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner texto="Cargando datos..." />
      </div>
    );
  }

  // Si YA cargó, muestra la página (los hijos)
  return <>{children}</>;
}