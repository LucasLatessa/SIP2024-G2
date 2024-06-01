import React, { useState } from "react";
import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import "./styles/escanearQR.css";
import { Scanner } from "@yudiel/react-qr-scanner";
import { cambiarEstadoTicket, getTicket } from "../../services/tickets.service";

//Escaner QR para las entradas
export const QrScannerComponent = () => {
  const { id } = useParams(); //Obtengo el id del evento
  const [idt, setidt] = useState(null);
  const [ide, setide] = useState(null);
  const [dni, setDni] = useState(null);
  const [error, setError] = useState(null);

  //Analizo la entrada para ver si corresponde a ese evento y no esta usada
  const analizarEntrada = async (data) => {
    if (data) {
      const [ide, idt, dni] = data.split("-"); //Formato de los datos IDT-IDE-DNI

      setidt(idt);
      setide(ide);
      //Si es una entrada de ese evento
      if (id === ide) {
        //Pertenece al evento, pero puede ser que este usada
        const ticketData = await obtenerTicket(idt);
        if (ticketData && !ticketData.usada) {
          setDni(dni);
          //Cambio el estado a usado
          cambiarEstado(idt);
        } else {
          setError("La entrada ya fue usada");
        }
      } else {
        setError("La entrada no pertenece a este evento");
      }
    }
  };

  //Obtengo el ticket en cuestion
  const obtenerTicket = async (idt) => {
    try {
      const res = await getTicket(idt);
      return res.data;
    } catch (error) {
      console.error("Error obteniendo el ticket:", error);
      setError("Error obteniendo el ticket");
      return null;
    }
  };

  //Realizo una peticion para cambiar el estado, asi no puede volver a usarla
  const cambiarEstado = async (idt) => {
    await cambiarEstadoTicket(idt);
  };

  return (
    <>
      <Header />
      <main>
        <h1 className="escanearQRTitulo">Validar entrada</h1>
        {!dni && (
          <Scanner onScan={(result) => analizarEntrada(result[0].rawValue)} />
        )}
        {error && <h2 className="escanearQR">{error}</h2>}
        {dni && (
          <section>
            <h2 className="escanearQR">Entrada valida, que lo disfrute!</h2>
            <ul className="datosEntradaQR">
              <li>Ticket: {idt}</li>
              <li>Evento: {ide}</li>
              <li>DNI: {dni}</li>
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};
