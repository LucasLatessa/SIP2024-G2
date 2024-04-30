import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { Carrusel } from "./Carrusel";
import "../styles/home.css";
import { ProximosEventos } from "./ProximosEventos";

export const Home = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <Header />
      <main className="App">
        {isAuthenticated && (
          <>
            Usted se logeo correctamente (para ver su perfil haga click arriba a
            la derecha)
          </>
        )}
        <Carrusel />
        <ProximosEventos />
      </main>
      <Footer />
    </>
  );
};
