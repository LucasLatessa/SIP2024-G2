import React from 'react'
import styles from "./Home.module.css";
import { NextEvents } from '../../components/Event/NextEvents/NextEvents';
import { getAllEventosAprobados } from "../../services/eventos.service";
import { useEffect, useState } from "react";
import { ViviLaExperiencia } from '../../components/ViviLaExperiencia/ViviLaExperiencia';

export default function Home(){
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    async function cargarEventos(){
      const res = await getAllEventosAprobados();
      //console.log(res.data);
      setEventos(res.data);
    }
    cargarEventos();
  }, [])

  useEffect(() => {
   console.log("Eventos cargados:", eventos);
  }, [eventos]);

  return (
    <>
      <main className="App">
        <NextEvents eventos={eventos}/>
        <ViviLaExperiencia/>
      </main>
    </>
  );
}
