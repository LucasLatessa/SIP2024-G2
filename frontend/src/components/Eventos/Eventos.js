import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { EventosBox } from "../EventosBox";
import "../styles/Eventos.css";
import { useFetch } from "../useFetch";


export const Eventos = () => {
  const {data, loading, error} = useFetch("http://127.0.0.1:8000/eventos/Eventos")

  return (
    <>
      <Header />
      <main>
        <header className="tituloEventos">
          <h1>Eventos</h1>
        </header>
        <section className="allListaEventosa">
          {error && <h2>Error: {error}</h2>}
          {loading && <h2>Loading...</h2>}
          {data?.map((evento) => (
            <EventosBox
            nombre={evento.nombre}
            foto={evento.imagen}
            precioMin={"500"}
            precioMax={"700"}
            fecha={evento.fecha}
            hora={evento.hora}
          />)
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};
