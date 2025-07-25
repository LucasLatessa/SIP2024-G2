import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import "../Eventos/styles/EventoPage.css";
import { useEffect, useState } from "react";
import { getPublicacion, crearPreferenciaEvento } from "../../services/publicacion.service";
import { getEvento } from "../../services/eventos.service";
import { getTicket, getTipoTicket } from "../../services/tickets.service";
import { getUser, getUserNick } from "../../services/usuarios.service";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useAuth0 } from "@auth0/auth0-react";

export const PublicacionPage = () => {
  const { id } = useParams();
  const [publicacion, setPublicacion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [userNoAuth0, setUserNoAuth0] = useState(null);
  const [userVendedor, setUserVendedor] = useState(null);

  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  // Cargar datos de la publicación y ticket
  useEffect(() => {
    const cargarPublicacion = async () => {
      try {
        const res = await getPublicacion(id);
        console.log("Publicación cargada:", res.data);
        setPublicacion(res.data);
        setUserVendedor(res.data.vendedorNombre);
      } catch (error) {
        console.error("Error al cargar la publicación:", error);
      }
    };
    cargarPublicacion();
  }, [id]);

  // Cargar datos del usuario vendedor
  useEffect(() => {
    const getUsuario = async () => {
      if (userVendedor) {
        try {
          const res = await getUserNick(userVendedor);
          setUserNoAuth0(res.data.usuario);
        } catch (error) {
          console.error("Error al obtener el usuario:", error);
        }
      }
    };
    getUsuario();
  }, [userVendedor]);

  // Comprar entrada
  const handleBuy = async () => {
    setButtonClicked(true);
    setLoading(true);
    try {
      console.log(userNoAuth0)
      if (userNoAuth0?.Public_Key) {
        initMercadoPago(userNoAuth0.Public_Key, { locale: "es-AR" });
        const ticket_publi_id = [publicacion.id];
        const res_id = await crearPreferenciaEvento(
          ticket_publi_id,
          publicacion.precio,
          user.nickname,
          publicacion.vendedorNombre
        );
        console.log("hola",res_id.data.preference_id)
        if (res_id?.data.success) setPreferenceId(res_id.data.preference_id);
      } else {
        console.error("El vendedor no tiene cuenta de MercadoPago");
      }
    } catch (error) {
      console.error("Error al iniciar la compra:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="App eventoPage">
        {publicacion ? (
          <div className="publicacion-container">
            <header className="headerEvento">
              <img
                className="imagen"
                src={publicacion.imagen}
                alt={`Imagen ${publicacion.eventoNombre}`}
              />
            </header>
            <article className="informacionEvento">
                <h1 className="titulo">{publicacion.eventoNombre}</h1>
                <p className="fecha">
                  Fecha del evento: {publicacion.evento_fecha} - {publicacion.evento_hora}
                </p>

              <section className="comprarEntrada">
                <h3>Compra tu entrada de reventa</h3>
                <div className="formComprarEntrada">
                  <div className="info-list">
                    <div className="info-row">
                      <span className="info-label">Tipo de entrada:</span>
                      <span className="info-value">{publicacion.tipo}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Precio de la entrada:</span>
                      <span className="info-value">${publicacion.precio}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Publicada por:</span>
                      <span className="info-value">{publicacion.vendedorNombre}</span>
                    </div>
                  </div>
                  <div className="comprarTicketsButton">
                    {isAuthenticated && (!buttonClicked || !preferenceId) && (
                      <button className="comprarEntradaBtn" onClick={handleBuy}>
                        Comprar
                      </button>
                    )}
                    {!isAuthenticated && (
                      <div className="login-message">
                        <p>
                          Para comprar entradas, por favor{" "}
                          <a href="#" onClick={e => { e.preventDefault(); loginWithRedirect(); }}>
                            inicia sesión
                          </a>.
                        </p>
                      </div>
                    )}
                    {buttonClicked && (
                      loading ? (
                        <div className="loading">Cargando...</div>
                      ) : preferenceId ? (
                        <div className="wallet-container">
                          <Wallet initialization={{ preferenceId: preferenceId }} />
                        </div>
                      ) : (
                        <div className="error-message">
                          No se pudo cargar la billetera porque el ID de preferencia es nulo
                        </div>
                      )
                    )}
                  </div>
                </div>
              </section>

              <section className="acercaDelEvento">
                <h3>Acerca del evento</h3>
                <p>{publicacion.eventoDesc}</p>
              </section>
              <section className="comoLLegar">
                <h3>Cómo llegar</h3>
                {/* Aquí puedes agregar un mapa de Google Maps si lo deseas */}
              </section>
            </article>
          </div>
        ) : (
          <p className="parrafo">Cargando...</p>
        )}
      </main>
      <Footer />
    </>
  );
};
