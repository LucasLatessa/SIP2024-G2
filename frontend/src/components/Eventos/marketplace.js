import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { EventosBox } from "../EventosBox";
import "../styles/Eventos.css";
import { FetchGET } from "../../services/service";
export const Marketplace = () => {
    const {data, loading, error} = FetchGET("http://127.0.0.1:8000/tickets/Publicacion/")

    return (
      <>
        <Header />
        <main>
          <header className="tituloEventos">
            <h1>Mercado</h1>
          </header>
          
          <section className="allListaEventosa">
            {error && <h2>Error: {error}</h2>}
            {loading && <h2>Cargando publicaciones...</h2>}
            {data?.map((publicacion) => (
              <EventosBox
              id={publicacion.id_Publicacion}
              nombre={publicacion.precio}
              foto={publicacion.imagen}
              precioMin={publicacion.precio}
              fecha={publicacion.fecha}
              hora={publicacion.hora}
            />)
            )}
          </section>
        </main>
  
        <Footer />
      </>
    );
  };
  