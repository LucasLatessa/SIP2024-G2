import React, { useState } from "react";
import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import "./styles/escanearQR.css";
import { Scanner } from "@yudiel/react-qr-scanner";
import { cambiarEstadoTicket, getTicket } from "../../services/tickets.service";
import { getEvento } from "../../services/eventos.service";

//Escaner QR para las entradas
export const QrScannerComponent = () => {
  const { id } = useParams(); //Obtengo el id del evento
  const [ticketInfo, setTicketInfo] = useState(null);
  const [error, setError] = useState(null);

  //Analizo la entrada para ver si corresponde a ese evento y no esta usada
  const analizarEntrada = async (data) => {
    setError(null);
    if (data) {
      const [ide, idt, dni] = data.split("-"); //Formato de los datos IDT-IDE-DNI
      try {
        const resEvento = await getEvento(ide);
        //Si es una entrada de ese evento
        if (id === ide) {
          //Pertenece al evento, pero puede ser que este usada
          const ticketData = await obtenerTicket(idt);
          if (ticketData && !ticketData.usada) {
            //Cambio el estado a usado
            await cambiarEstado(idt);
            setTicketInfo({
              idt,
              ide: resEvento.data.nombre,
              dni,
              mensaje: "Entrada valida, que lo disfrute!",
            });
          } else {
            setTicketInfo(null);
            setError("La entrada ya fue usada");
          }
        } else {
          setTicketInfo(null);
          setError("La entrada no pertenece a este evento");
        }
      } catch (e) {
        setTicketInfo(null);
        setError("Error procesando la entrada");
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

  const limpiarInfo = () => {
    setTicketInfo(null);
    setError(null);
  };

  return (
    <>
      <Header />
      <main style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div>
          <h1 className="escanearQRTitulo">Validar entrada</h1>
          <Scanner onScan={(result) => result && analizarEntrada(result[0].rawValue)} />
        </div>
        <div>
          {error && (
            <div>
              <h2 className="escanearQR">{error}</h2>
              <button onClick={limpiarInfo}>Limpiar</button>
            </div>
          )}
          {ticketInfo && (
            <section>
              <h2 className="escanearQR">{ticketInfo.mensaje}</h2>
              <ul className="datosEntradaQR">
                <li>Ticket: {ticketInfo.idt}</li>
                <li>Evento: {ticketInfo.ide}</li>
                <li>DNI: {ticketInfo.dni}</li>
              </ul>
              <button onClick={limpiarInfo}>Limpiar</button>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};
