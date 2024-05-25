import React from "react";
import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import Carousel from './Carousel';
import "../styles/home.css";
import { ProximosEventos } from "./ProximosEventos";
import { ViviLaExperiencia } from "./ViviLaExperiencia";
import { getAllEventosAprobados } from "../../services/eventos.service";
import { useEffect, useState } from "react";
export const Home = () => {
  const [eventos, setEventos] = useState([]);

  //Realizo la peticion
  useEffect(() => {
    async function cargarEventos(){
      const res = await getAllEventosAprobados();
      setEventos(res.data);
    }
    cargarEventos();
  }, [])
  return (
    <>
      <Header />
      <main className="App">
        <Carousel eventos={eventos}/>
        <ProximosEventos eventos={eventos}/>
        <ViviLaExperiencia />
      </main>
      <Footer />
    </>
  );
};
