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
  const [error, setError] = useState(null);
  const [precioEntrada, setPrecioEntrada] = useState(null);
  const { user, isAuthenticated, getAccessTokenSilently, loginWithRedirect } =
    useAuth0();
  const { id } = useParams(); //Obtengo el id del evento
  const backendUrl = process.env.REACT_APP_DJANGO_BACKEND;
  const { getValues, register } = useForm();
  const [evento, setEvento] = useState(null);
  const [token, setToken] = useState();
  const [maxCantidadTickets, setMaxCantidadTickets] = useState(null); // cantidad maxima segun tipo
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
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  //Realizo la peticion para obtener el evento y mostrar sus datos en pantalla
  useEffect(() => {
    async function cargarEventos() {
      const resEvento = await getEvento(id);
      console.log("Evento obtenido:", resEvento);
      const evento = resEvento.data;
      const fechaFormateada = new Date(evento.fecha).toLocaleDateString(
        "es-AR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );

      setEvento({
        ...evento,
        fecha: fechaFormateada,
      });
    }
    cargarEventos();
  }, [id, getAccessTokenSilently]);

  //Realizo la compra de tickets
  const handleBuy = async () => {
  setButtonClicked(true);
  setLoading(true);
  setError("");

  const quantity = parseInt(getValues("cantidadEntradas"));
  // Validar tipo de ticket
  if (!tipoTicket) {
    setError("Seleccioná un tipo de entrada.");
    setLoading(false);
    return;
  }
  // Validar cantidad
  if (isNaN(quantity) || quantity < 1) {
    setError("Ingresá una cantidad válida de entradas.");
    setLoading(false);
    return;
  }
  
  const ticket_id_list = await obtenerTicket(quantity, id, tipoTicket);

  if (ticket_id_list.length === quantity) {
    const result = await createPreference(ticket_id_list, quantity);
    console.log("Resultado de la preferencia:", result);
    if (result?.success) {
      setPreferenceId(result.preference_id);

      await axios.get(`${backendUrl}/tickets/reservar_ticket/`, {
        params: {
          ticket_id: ticket_id_list.join(","),
        },
      });
    } else {
      setError("Hubo un error al crear la preferencia de pago.");
    }

  } else {
    setError(`Hay ${ticket_id_list.length} tickets disponibles.`);
  }

  setLoading(false);
};

  const handleTipoEntradaChange = async (e) => {
    const tipo = e.target.value;
    setTipoTicket(tipo);

    // buscar la cantidad disponible del tipo elegido
    const entradaSeleccionada = evento.tickets_por_tipo.find(
      (t) => t.tipo_ticket__tipo === tipo
    );
    setMaxCantidadTickets(entradaSeleccionada?.cantidad || null); // actualiza el max del input

    // pedir el precio al backend
    try {
      const response = await axios.get(
        `${backendUrl}/tickets/obtener_precio_entrada/`,
        {
          params: {
            tipo_ticket: tipo,
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
        {evento ? (
          <div className="publicacion-container">
            <header className="headerEvento">
              <img
                className="imagen"
                src={evento.imagen}
                alt={"Imagen " + evento.nombre}
              />
            </header>
            <article className="informacionEvento">
              <h1 className="titulo">{evento.nombre}</h1>
              <p className="fecha">
                Fecha del evento: {evento.fecha} - {evento.hora}
              </p>

              <section className="comprarEntrada">
                <h3>Compra tu entrada</h3>
                <form
                  className="formComprarEntrada"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleBuy();
                  }}
                >
                  <label>
                    Tipo de entrada
                    <select
                      id="tipoEntrada"
                      onChange={handleTipoEntradaChange}
                      defaultValue=""
                      disabled={!!preferenceId}
                    >
                      <option value="" disabled>
                        Selecciona una opcion
                      </option>
                      {evento?.tickets_por_tipo.map((tipo) => (
                        <option
                          key={tipo.tipo_ticket__tipo}
                          value={tipo.tipo_ticket__tipo}
                        >
                          {tipo.tipo_ticket__tipo} (Disponibles: {tipo.cantidad}
                          )
                        </option>
                      ))}
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
                          value > 0 || "Debe ser un numero positivo",
                      })}
                      disabled={!!preferenceId}
                      min="1"
                      max={maxCantidadTickets || undefined}
                      onInput={(e) => {
                        if (e.target.value < 1) {
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>
                  {precioEntrada && (
                    <p className="parrafo">
                      Precio por entrada: {precioEntrada}
                    </p>
                  )}
                  <div className="comprarTicketsButton">
                    {isAuthenticated && (!buttonClicked || !preferenceId) && (
                      <button className="comprarEntradaBtn" type="submit">
                        Comprar
                      </button>
                    )}
                    {!isAuthenticated && (
                      <div className="login-message">
                        <p>
                          Para comprar entradas, por favor{" "}
                          <a href="" onClick={loginWithRedirect}>
                            inicia sesión
                          </a>
                          .
                        </p>
                      </div>
                    )}
                    <ToastContainer />
                    {buttonClicked && (
                      <>
                        {loading ? (
                          <div className="loading">Cargando...</div>
                        ) : preferenceId ? (
                          <div className="wallet-container">
                            <Wallet
                              initialization={{ preferenceId: preferenceId }}
                            />
                          </div>
                        ) : (
                          <div className="error-message">
                            {error}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </form>
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
          </div>
        ) : (
          <p>No existe el evento</p>
        )}
      </main>
      <Footer />
    </>
  );
};
