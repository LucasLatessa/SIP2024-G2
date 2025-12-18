import React, { useState } from "react";
import { useParams } from "react-router";
import "./ValidarEntrada.css";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  cambiarEstadoTicket,
  getTicket,
} from "../../../../services/tickets.service";

const ValidarEntrada = () => {
  const { id } = useParams(); //Obtengo el id del evento
  const [idt, setidt] = useState(null);
  const [ide, setide] = useState(null);
  const [dni, setDni] = useState(null);
  const [error, setError] = useState(null);

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
    <article className="validarEntrada">
      <h1>Validar entrada</h1>
      <hr />
      <section className="sectionValidarEntrada">
        <div className="scanner">
        {!dni && (
          <Scanner onScan={(result) => analizarEntrada(result[0].rawValue)} />
        )}
        </div>
        {error && <h2 className="escanearQR">{error}</h2>}
        {dni && (
          <article className="entradaValidada">
            <h2 className="title">Entrada valida, que lo disfrute!</h2>
            <ul className="datosEntradaQR">
              <li>
                Ticket: <span>{idt}</span>
              </li>
              <li>
                Evento: <span>{ide}</span>
              </li>
              <li>
                DNI: <span>{dni}</span>
              </li>
            </ul>
          </article>
        )}
      </section>
    </article>
  );
};

export default ValidarEntrada;
