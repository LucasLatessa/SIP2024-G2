import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import "./styles/Eventos.css";
import { getAllEventosAprobados } from "../../services/eventos.service";
import { useEffect, useState } from "react";
import { EventosBox } from "./EventosBox";

// Página donde se mostraran todos los eventos posibles
export const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [filteredEventos, setFilteredEventos] = useState([]);

  useEffect(() => {
    async function cargarEventos() {
      const res = await getAllEventosAprobados();
      setEventos(res.data);
      setFilteredEventos(res.data);
    }

    cargarEventos();
  }, []);

  // Convertir "dd/mm/yyyy" a Date
  const parseFecha = (strFecha) => {
    const [dia, mes, anio] = strFecha.split("/");
    return new Date(`${anio}-${mes}-${dia}`);
  };

  const applyFilters = () => {
    let filtered = eventos;

    if (search) {
      filtered = filtered.filter((evento) =>
        evento.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (date) {
      const fechaFiltro = new Date(date); // "yyyy-mm-dd"
      filtered = filtered.filter((evento) => {
        const fechaEvento = parseFecha(evento.fecha);
        return fechaEvento >= fechaFiltro;
      });
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
        <header className="tituloEventosAll">
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
          {filteredEventos.length > 0 ? (
            filteredEventos.map((evento) => (
              <EventosBox
                key={evento.id_Evento}
                id={evento.id_Evento}
                nombre={evento.nombre}
                foto={evento.imagen}
                precioMin={evento.precioMin}
                precioMax={evento.precioMax}
                fecha={evento.fecha}
                hora={evento.hora}
              />
            ))
          ) : (
            <p style={{ textAlign: "center" }}>
              No se encontraron eventos con los filtros seleccionados.
            </p>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};
