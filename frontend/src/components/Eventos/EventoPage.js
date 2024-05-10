import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import {
  FetchGET,
  getAllEventos,
  getEvento,
} from "../../services/eventos.service";
import "../styles/EventoPage.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from 'axios';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useAuth0 } from "@auth0/auth0-react";

//Pagina donde se mostrara datos del evento y la posibilidad de comprar entradas
export const EventoPage = () => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const { user } = useAuth0();
  
    
  initMercadoPago("TEST-ad9af574-3705-4b15-b991-f28af2497f9f", { locale: "es-AR" });

  const obtenerTicket = async (quantity, id) => {
    try {
        const response = await axios.get("http://localhost:8000/tickets/obtener_ticket_evento/",{
            params: {
                evento_id:id,
                quantity:quantity
            }
        });
        console.log(response.data.ticket_id_list);
        return response.data.ticket_id_list;

    } catch (error) {
        console.log(error);
        return [];
    }
  };

  const createPreference = async (ticket_id_list, quantity) => {
    try {
        const response = await axios.post("http://localhost:8000/tickets/prueba_mercadopago/", {
            quantity: quantity,
            ticket_id: ticket_id_list,
            unit_price: 1,
            description: user.nickname
        });
        return response.data.id;
    } catch (error) {
        console.log(error);
        return null;
    }
  };

  const { id } = useParams(); //Obtengo el id del evento
  const {
    getValues,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [eventos, setEventos] = useState([]);
  const [tickets, setTickets] = useState([]);

  //Realizo la peticion para obtener el evento
  useEffect(() => {
    async function cargarEventos() {
      const resEvento = await getEvento(id); //Solo eventos validos, si no existe hay que arreglarlo
      setEventos(resEvento.data);
    }
    cargarEventos();
  }, []);

  /*Compra de tickets*/
  const handleBuy = async () => {
    setButtonClicked(true);
    setLoading(true);
    const quantity = parseInt(getValues("cantidadEntradas"));

    const ticket_id_list = await obtenerTicket(quantity, id);
    if (ticket_id_list.length === quantity) {
        const id = await createPreference(ticket_id_list, quantity);
        if (id) {
            setPreferenceId(id);
        }
    }
    setLoading(false); // Indicar que la carga ha terminado    
  }

  return (
    <>
      <Header />
      <main className="App eventoPage">
        {eventos ? ( // Si existe el evento muestro los datos
          <>
            <header className="headerEvento">
              <img
                className="imagen"
                src={eventos.imagen}
                alt={"Imagen " + eventos.nombre}
              />
            </header>
            <article className="informacionEvento">
              <section className="titulo-fecha">
                <h1 className="titulo">{eventos.nombre}</h1>
                <p className="fecha">
                  Fecha del evento: {eventos.fecha} - {eventos.hora}
                </p>
              </section>

              <section className="comprarEntrada">
                <h3>Compra tu entrada</h3>
                <div className="formComprarEntrada">
                  {/* COMPRAR ENTRADA FORM */}
                  <label htmlFor=""> Tipo de entrada
                    <select
                      {...register("tipoEntrada", {
                        required: true,
                      })}
                    >
                      <option value="STANDARD">STANDARD</option>
                      <option value="PLATINIUM">PLATINIUM</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </label>

                  <label>
                    Cantidad Entrada
                    <input
                      type="number"
                      {...register("cantidadEntradas", {
                        required: true,
                      })}
                    />
                  </label>
                  <div className='test'>
                    <button onClick={handleBuy}>Comprar</button>
                      {buttonClicked && (
                          loading ? (
                              <div>Cargando...</div>
                          ) : (
                              preferenceId ? (
                                  <div>
                                      <Wallet initialization={{ preferenceId: preferenceId }} />
                                  </div>
                              ) : (
                                  <div>No se pudo cargar la billetera porque el ID de preferencia es nulo</div>
                              )
                          )
                      )}
                 </div>
                </div>
              </section>
              <section className="acercaDelEvento">
                <h3>Acerca del evento</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
                  totam ut ipsum obcaecati neque voluptate labore nesciunt
                  eligendi ab mollitia. Ipsa, culpa voluptatibus? Repudiandae
                  minus corporis, ab ipsam eum est?
                </p>
              </section>
              <section className="comoLLegar">
                <h3>Como llegar</h3>
                {/* Mapita de Google Maps*/}
              </section>
            </article>
          </>
        ) : (
          <p>No existe el evento</p> // NO ANDA POR EL MOMENTO
        )}
        <section className="comprarEntradas">
          <form>{/* En proceso */}</form>
        </section>
      </main>
      <Footer />
    </>
  );
};
