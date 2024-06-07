import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useAuth0 } from "@auth0/auth0-react";

export const Login = () => {
  const { loginWithRedirect } = useAuth0();

  const Login = () => {
    loginWithRedirect();
  };

  const RegisterProductora = () => {
    loginWithRedirect({
      screen_hint: "signup",
      authorizationParams: {
        user_metadata: JSON.stringify({ role: "productora" }),
      },
    });
  };

  const RegisterCliente = () => {
    loginWithRedirect({
      screen_hint: "signup",
      authorizationParams: {
        user_metadata: JSON.stringify({ role: "usuario" }),
      },
    });
  };

  return (
    <>
      <Header />
      <main>
        <section>
          <h2>¡Hola de nuevo!</h2>
          <button onClick={Login}>Iniciar sesion</button>
        </section>
        <section>
          <h2>Todavia no sos parte de la familia ByPass? Registrate</h2>
          <button onClick={RegisterCliente}>Registrarse como usuario</button>
          <button onClick={RegisterProductora}>Registrarse como productora</button>
        </section>
        <section></section>
      </main>
      <Footer />
    </>
  );
};
