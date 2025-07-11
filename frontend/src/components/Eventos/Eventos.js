import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import "./styles/Eventos.css";
import { getAllEventosAprobados } from "../../services/eventos.service";
import { useEffect, useState } from "react";
import { EventosBox } from "./EventosBox";

//Pagina donde se mostraran todos los eventos posibles
export const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [filteredEventos, setFilteredEventos] = useState([]);

  //Realizo la peticion para obtener todos los eventos
  useEffect(() => {
    async function cargarEventos() {
      const res = await getAllEventosAprobados();
      setEventos(res.data);
      setFilteredEventos(res.data);
    }

    cargarEventos();
  }, []);

  /* --------------------
          FILTROS
  --------------------*/

  const applyFilters = () => {
    let filtered = eventos;

    if (search) {
      filtered = filtered.filter((evento) =>
        evento.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (date) {
      filtered = filtered.filter((evento) => evento.fecha >= date);
    }
    setFilteredEventos(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [search, date, eventos]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "search") {
      setSearch(value);
    } else if (name === "date") {
      setDate(value);
    }
  };

  return (
    <>
      <Header />
      <main>
        <header className="tituloEventos">
          <h1>Eventos</h1>
        </header>

        <section className="sectionFiltros">
          <h2 className="tituloFiltros">Filtros</h2>
          <form className="formFiltros">
            <label>
              Nombre:
              <input
                type="text"
                name="search"
                value={search}
                onChange={handleFilterChange}
              />
            </label>
            <label>
              Fecha desde:
              <input
                type="date"
                name="date"
                value={date}
                onChange={handleFilterChange}
              />
            </label>
          </form>
        </section>

        <section className="allListaEventosa">
          {filteredEventos?.map(
            (eventos) => ( //Obtengo todos los eventos y utilizo el componente para mostrarlos
              <EventosBox
                key={eventos.id}
                id={eventos.id_Evento}
                nombre={eventos.nombre}
                foto={eventos.imagen}
                precioMin={eventos.precioMin}
                precioMax={eventos.precioMax}
                fecha={eventos.fecha}
                hora={eventos.hora}
              />
            )
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};
