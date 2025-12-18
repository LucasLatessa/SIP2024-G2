import React from "react";
import styles from "./EventDetail.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getEvento } from "../../services/eventos.service";
import { formatDateEventDetail } from "../../utils/formatDateEventDetail";
import { useForm } from "react-hook-form";
import { useAuth0 } from "@auth0/auth0-react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

/* Iconos */
import { TiTicket } from "react-icons/ti";
import { MdOutlineDateRange } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import {
  obtenerPrecioEntrada,
  obtenerTicketEvento,
  pruebaMercadoPago,
} from "../../services/tickets.service";

export default function EventDetail() {
  const { id } = useParams();
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [tipoTicket, setTipoTicket] = useState(null);
  const [precioEntrada, setPrecioEntrada] = useState(null);
  const [total, setTotal] = useState(null);
  const { user, getAccessTokenSilently } = useAuth0();
  const { getValues, register, watch } = useForm();
  const [eventos, setEventos] = useState([]);
  const [token, setToken] = useState();
  const cantidadSeleccionada = watch("cantidadEntradas");
  const precioTotalCalculado =
    precioEntrada && cantidadSeleccionada
      ? Number(precioEntrada) * Number(cantidadSeleccionada)
      : 0;

  const { fecha: fechaFormat, hora: horaFormat } = formatDateEventDetail(
    eventos.fecha,
    eventos.hora
  );

  initMercadoPago("APP_USR-c2efa0aa-3b60-4f2e-9d59-2e6922b0d2b2", {
    locale: "es-AR",
  });

  //Obtengo los tickets que seran procesados
  const obtenerTicket = async (quantity, id, tipo_ticket) => {
    console.log("obtenerticketaction");
    try {
      const response = await obtenerTicketEvento(
        id,
        quantity,
        tipoTicket,
        token
      );
      console.log("obtenerticket", response);
      return response.data.ticket_id_list;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  //Creo la preferencias para llevar a cabo el pago por MP
  const createPreference = async (ticket_id_list, quantity) => {
    try {
      const response = await pruebaMercadoPago(
        quantity,
        ticket_id_list,
        precioEntrada,
        user.nickname
      );
      return response.data.id;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  //Realizo la peticion para obtener el evento y mostrar sus datos en pantalla
  useEffect(() => {
    async function cargarEventos() {
      const resEvento = await getEvento(id); //Solo eventos válidos, si no existe hay que arreglarlo
      setEventos(resEvento.data);
    }

    async function obtenerToken() {
      const token = await getAccessTokenSilently();
      setToken(token);
    }

    cargarEventos();
    obtenerToken();
  }, [id, getAccessTokenSilently]);

  //Realizo la compra de tickets
  const handleBuy = async () => {
    setButtonClicked(true);
    setLoading(true);
    const quantity = parseInt(getValues("cantidadEntradas"));

    const ticket_id_list = await obtenerTicket(quantity, id);
    console.log(ticket_id_list);
    if (ticket_id_list.length === quantity) {
      const id = await createPreference(ticket_id_list, quantity);
      if (id) {
        setPreferenceId(id);
        console.log(id);
      }
    }
    setLoading(false); // Indicar que la carga ha terminado
  };

  const handleTipoEntradaChange = async (e) => {
    setTipoTicket(e.target.value);
    console.log(e.target.value);
    console.log(tipoTicket);
    console.log(id);
    try {
      const response = await obtenerPrecioEntrada(e.target.value, id);
      setPrecioEntrada(response.data.precio_ticket);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className={styles.eventDetail}>
      {/* Banner */}
      <header className={styles.headerEventDetail}>
        <img
          className={styles.imagenEventDetail}
          src={eventos.imagen}
          alt={"Imagen " + eventos.nombre}
        />
      </header>

      {/* Informacion del evento */}
      <article className={styles.infEventDetail}>
        <h1 className={styles.titleEventDetail}>{eventos.nombre}</h1>

        <div className={styles.fechaTicketsEventDetail}>
          {/* Fecha-Hora */}
          <section className={styles.fechaEventDetail}>
            <h2 className={styles.titleFecha}> Fecha y hora</h2>
            <ul className={styles.fechaHora}>
              <li>
                <MdOutlineDateRange /> {fechaFormat}
              </li>
              <li>
                <IoTimeOutline /> {horaFormat}
              </li>
            </ul>
          </section>

          {/* Informacion del tickets */}
          <section className={styles.ticketEventDetail}>
            <h3 className={styles.informationTicket}>
              {" "}
              Informacion de Tickets
            </h3>
            <ul className={styles.listaTicket}>
              <li>
                {" "}
                <TiTicket /> Standard
              </li>
              <li>
                {" "}
                <TiTicket /> Premium
              </li>
              <li>
                {" "}
                <TiTicket /> Platino
              </li>
            </ul>

            {/* COMPRA DE ENTRADA */}
            <section className={styles.comprarEntrada}>
              <h4 className={styles.titleComprarEntrada}>Compra tu entrada</h4>

              <section className={styles.formComprarEntrada}>
                <label>
                  Tipo de entrada
                  <select
                    id="tipoEntrada"
                    onChange={handleTipoEntradaChange}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    <option value="STANDARD">STANDARD</option>
                    <option value="PLATINIUM">PLATINIUM</option>
                    <option value="VIP">VIP</option>
                  </select>
                </label>

                <label>
                  Cantidad
                  <input
                    type="number"
                    min="1"
                    {...register("cantidadEntradas", {
                      required: true,
                    })}
                  />
                </label>

                <div className={styles.precioTotal}>
                  {precioEntrada && (
                    <p className={styles.precioEntrada}>
                      Precio de la entrada: ${precioEntrada}
                    </p>
                  )}
                  {precioTotalCalculado > 0 && (
                    <p className={styles.totalEntrada}>
                      Total: ${precioTotalCalculado}
                    </p>
                  )}
                </div>

                <section className={styles.comprarTicketsButton}>
                  {!buttonClicked && (
                    <button onClick={handleBuy}>Comprar</button>
                  )}

                  {buttonClicked &&
                    (loading ? (
                      <div className={styles.loading}>Cargando...</div>
                    ) : preferenceId ? (
                      <Wallet initialization={{ preferenceId }} />
                    ) : (
                      <div className={styles.errorWallet}>
                        No se pudo cargar la billetera
                      </div>
                    ))}
                </section>
              </section>
            </section>
            {/* <button> <TiTicket /> Comprar Ticket</button> */}
          </section>
        </div>

        {/* Acerca del evento */}
        <section className={styles.descriptionEventDetail}>
          <h3 className={styles.titleDescription}>Acerca del evento</h3>
          <p className={styles.description}>{eventos.descripcion}</p>
        </section>
      </article>
    </main>
  );
}
