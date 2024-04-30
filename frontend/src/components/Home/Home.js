import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { Carrusel } from "./Carrusel";
import "../styles/home.css";
import { ProximosEventos } from "./ProximosEventos";
import { ViviLaExperiencia } from "./ViviLaExperiencia";

export const Home = () => {
  return (
    <>
      <Header />
      <main className="App">
        <Carrusel />
        <ProximosEventos />
        <ViviLaExperiencia />
      </main>
      <Footer />
    </>
  );
};
