import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import { getEvento } from "../../services/eventos.service";
import "./styles/EventoPage.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Pagina donde se mostrara datos del evento y la posibilidad de comprar entradas
export const EventoPage = () => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [tipoTicket, setTipoTicket] = useState(null);
  const [precioEntrada, setPrecioEntrada] = useState(null);
  const { user,isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const [cantTickets, setcantTickets] = useState(null);
  const { id } = useParams(); //Obtengo el id del evento
  const backendUrl = process.env.REACT_APP_DJANGO_BACKEND;
  const { getValues, register } = useForm();
  const [evento, setEvento] = useState([]);
  const [token, setToken] = useState();

  initMercadoPago("APP_USR-c2efa0aa-3b60-4f2e-9d59-2e6922b0d2b2", {
    locale: "es-AR",
  });

  //Obtengo los tickets que seran procesados
  const obtenerTicket = async (quantity, id, tipo_ticket) => {
    try {
      const token = await getAccessTokenSilently();
      setToken(token);
      
      const response = await axios.get(
        `${backendUrl}/tickets/obtener_ticket_evento/`,
        {
          params: {
            evento_id: id,
            quantity: quantity,
            tipo_ticket: tipo_ticket,
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
        `${backendUrl}/tickets/prueba_mercadopago/`,
        {
          quantity: quantity,
          ticket_id: ticket_id_list,
          unit_price: precioEntrada,
          description: user.nickname,
        }
      );
      return response.data.id;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  //Realizo la peticion para obtener el evento y mostrar sus datos en pantalla
  useEffect(() => {
    async function cargarEventos() {
      const resEvento = await getEvento(id); //Solo eventos válidos, si no existe hay que arreglarlo
      setEvento(resEvento.data);
    }

    

    cargarEventos();

  }, [id, getAccessTokenSilently]);

  //Realizo la compra de tickets
  const handleBuy = async () => {
    setButtonClicked(true);
    setLoading(true);
    const quantity = parseInt(getValues("cantidadEntradas"));

    const ticket_id_list = await obtenerTicket(quantity, id,tipoTicket);
    if (ticket_id_list.length === quantity) {
      const id = await createPreference(ticket_id_list, quantity);
      if (id) {
        setPreferenceId(id);
        toast.success("¡Compra realizada con éxito!(ESTA MAL, SOLO PRUEBA)");
      }
    } else {
      setcantTickets(ticket_id_list.length);
    }

    setLoading(false); // Indicar que la carga ha terminado
  };

  const handleTipoEntradaChange = async (e) => {
    setTipoTicket(e.target.value);
    try {
      const response = await axios.get(
        `${backendUrl}/tickets/obtener_precio_entrada/`,
        {
          params: {
            tipo_ticket: e.target.value,
            evento: id,
          },
        }
      );

      setPrecioEntrada(response.data.precio_ticket);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <main className="App eventoPage">
        {evento ? ( // Si existe el evento muestro los datos
          <>
            <header className="headerEvento">
              <img
                className="imagen"
                src={evento.imagen}
                alt={"Imagen " + evento.nombre}
              />
            </header>
            <article className="informacionEvento">
              <section className="titulo-fecha">
                <h1 className="titulo">{evento.nombre}</h1>
                <p className="fecha">
                  Fecha del evento: {evento.fecha} - {evento.hora}
                </p>
              </section>

              <section className="comprarEntrada">
                <h3>Compra tu entrada</h3>
                <section className="formComprarEntrada">
                  {/* COMPRAR ENTRADA FORM */}
                  <label>
                    Tipo de entrada
                    <select
                      id="tipoEntrada"
                      onChange={handleTipoEntradaChange}
                      defaultValue=""
                      disabled={!!preferenceId}
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
                    Cantidad Entradas
                    <input
                      type="number"
                      id="cantidadEntradas"
                      name="cantidadEntradas"
                      {...register("cantidadEntradas", {
                        required: true,
                        validate: (value) =>
                          value > 0 || "Debe ser un número positivo", // Valida que sea positivo
                      })}
                      disabled={!!preferenceId}
                      min="1"
                      onInput={(e) => {
                        if (e.target.value < 1) {
                          e.target.value = ""; // Limpia el valor si es menor a 1
                        }
                      }}
                    />
                  </label>
                  {precioEntrada && <p className="parrafo">Precio por entrada: {precioEntrada}</p>}
                  <section className="comprarTicketsButton">
                    {/* Mostrar botón de comprar solo si no se ha hecho clic y no hay preferenceId */}
                    {isAuthenticated &&(!buttonClicked || !preferenceId )? (
                        <button className="comprarEntrada" onClick={handleBuy}>
                          Comprar
                        </button>
                      ) : null}
                      {!isAuthenticated && (
                        <div className="login-message">
                          <p>
                            Para comprar entradas, por favor <a href="" onClick={loginWithRedirect}>inicia sesión</a>.
                          </p>
                        </div>
                      )}
                    
                    <ToastContainer />
                    {/* Si el botón fue clickeado */}
                    {buttonClicked && (
                      <>
                        {/* Si está cargando, mostramos "Cargando..." */}
                        {loading ? (
                          <div>Cargando...</div>
                        ) : // Si tenemos un preferenceId, mostramos el componente Wallet de MercadoPago
                        preferenceId ? (
                          <div>
                            <Wallet
                              initialization={{ preferenceId: preferenceId }}
                            />
                          </div>
                        ) : (
                          // Si no tenemos preferenceId, mostramos la cantidad de tickets disponibles
                          <div>Cantidad tickets disponibles: {cantTickets}</div>
                        )}
                      </>
                    )}
                  </section>
                </section>
              </section>
              <section className="acercaDelEvento">
                <h3>Acerca del evento</h3>
                <p>{evento.descripcion}</p>
              </section>
              <section className="comoLLegar">
                <h3>Como llegar</h3>
                {/* Mapita de Google Maps*/}
              </section>
            </article>
          </>
        ) : (
          <p>No existe el evento</p>
        )}
      </main>
      <Footer />
    </>
  );
};
