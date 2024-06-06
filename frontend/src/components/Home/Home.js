import React from "react";
import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import Carousel from './Carousel';
import { ProximosEventos } from "./ProximosEventos";
import { ViviLaExperiencia } from "./ViviLaExperiencia";
import { getAllEventosAprobados } from "../../services/eventos.service";
import { useEffect, useState } from "react";

//Home del sitio
export const Home = () => {
  const [eventos, setEventos] = useState([]);

  //Realizo la peticion para obtener los eventos
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
