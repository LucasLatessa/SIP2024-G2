import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import {
  getEvento,
} from "../../services/eventos.service";
import "./styles/EventoPage.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useAuth0 } from "@auth0/auth0-react";

//Pagina donde se mostrara datos del evento y la posibilidad de comprar entradas
export const EventoPage = () => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [tipoTicket, setTipoTicket] = useState(null);
  const [precioEntrada, setPrecioEntrada] = useState(null);
  const { user,getAccessTokenSilently } = useAuth0();
  const { id } = useParams(); //Obtengo el id del evento
  const {
    getValues,
    register,
  } = useForm();
  const [eventos, setEventos] = useState([]);
  const [token, setToken] = useState();

  initMercadoPago("APP_USR-c2efa0aa-3b60-4f2e-9d59-2e6922b0d2b2", {
    locale: "es-AR",
  });
    
  //Obtengo los tickets que seran procesados
  const obtenerTicket = async (quantity, id, tipo_ticket) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/tickets/obtener_ticket_evento/",
        {
          params: {
            evento_id: id,
            quantity: quantity,
            tipo_ticket: tipoTicket,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.ticket_id_list;
    } catch (error) {
      return [];
    }
  };

  //Creo la preferencias para llevar a cabo el pago por MP
  const createPreference = async (ticket_id_list, quantity) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/tickets/prueba_mercadopago/",
        {
          quantity: quantity,
          ticket_id: ticket_id_list,
          unit_price: precioEntrada,
          description: user.nickname,
        }
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
    try {
      const response = await axios.get(
        "http://localhost:8000/tickets/obtener_precio_entrada/",
        {
          params: {
            tipo_ticket: e.target.value,
            evento: id,
          },
        }
      );

      setPrecioEntrada(response.data.precio_ticket);
    } catch (error) {
      console.log(error);
    }
  };

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
                <section className="formComprarEntrada">
                  {/* COMPRAR ENTRADA FORM */}
                  <label >
                    {" "}
                    Tipo de entrada
                    <select id="tipoEntrada"  onChange={handleTipoEntradaChange} defaultValue="">
                      <option value="" disabled>
                        Selecciona una opción
                      </option>
                      <option value="STANDARD">STANDARD</option>
                      <option value="PLATINIUM">PLATINIUM</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </label>

                  {precioEntrada && (
                    <p>Precio de la entrada: {precioEntrada}</p>
                  )}

                  <label >
                    Cantidad Entrada
                    <input
                      type="number"
                      id="cantidadEntradas"
                      name="cantidadEntradas"
                      {...register("cantidadEntradas", {
                        required: true,
                      })}
                    />
                  </label>
                  <section className="comprarTicketsButton">
                    <button onClick={handleBuy}>Comprar</button>
                    {buttonClicked &&
                      (loading ? (
                        <div>Cargando...</div>
                      ) : preferenceId ? (
                        <div>
                          preferenceId
                          <Wallet
                            initialization={{ preferenceId: preferenceId }}
                          />
                        </div>
                      ) : (
                        <div>
                          No se pudo cargar la billetera porque el ID de
                          preferencia es nulo
                        </div>
                      ))}
                  </section>
                </section>
              </section>
              <section className="acercaDelEvento">
                <h3>Acerca del evento</h3>
                <p>
                  {eventos.descripcion}
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
