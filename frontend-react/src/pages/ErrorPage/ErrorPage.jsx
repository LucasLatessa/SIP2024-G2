import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <main style={{ padding: "4rem", textAlign: "center" }}>
      <h1>Oops! Algo salió mal.</h1>

      <p>{error?.statusText || error?.message}</p>

      <a href="/">Volver al inicio</a>
    </main>
  );
}
