import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { PublicacionesBox } from "./PublicacionesBox";
import "../Eventos/styles/Eventos.css";
import { getAllPublicacion } from "../../services/publicacion.service";
import { getEvento } from "../../services/eventos.service";
import { getTicket } from "../../services/tickets.service";
import { useEffect, useState } from "react";

//Mercado de entradas
export const Marketplace = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [entryType, setEntryType] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);

  //Traigo todas las publicaciones
  useEffect(() => {
    async function cargarPublicaciones() {
      try {
        const res = await getAllPublicacion();
        const publicacionesConInfoCompleta = await Promise.all(
          res.data.map(async (publicacion) => {
            const ticketRes = await getTicket(publicacion.ticket);
            const eventoRes = await getEvento(ticketRes.data.evento);
            return {
              id: publicacion.id_Publicacion,
              precio: publicacion.precio,
              fecha: publicacion.fecha,
              foto: eventoRes.data.imagen,
              eventoNombre: eventoRes.data.nombre,
              eventoFecha: eventoRes.data.fecha,
              eventoHora: eventoRes.data.hora,
            };
          })
        );
        setPublicaciones(publicacionesConInfoCompleta);
      } catch (error) {
        console.error("Error al cargar las publicaciones:", error);
      }
    }
    cargarPublicaciones();
  }, []);

  /* --------------------
          FILTROS
     --------------------*/

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "search") {
      setSearch(value);
    } else if (name === "minPrice") {
      setMinPrice(value);
    } else if (name === "maxPrice") {
      setMaxPrice(value);
    } else if (name === "entryType") {
      setEntryType(value);
    }

    let filtered = publicaciones;

    if (name === "search" && value) {
      filtered = filtered.filter(ticket =>
        ticket.eventoNombre.toLowerCase().includes(value.toLowerCase())
      );
    } else if (name === "minPrice" && value) {
      filtered = filtered.filter(ticket => ticket.precio >= parseFloat(value));
    } else if (name === "maxPrice" && value) {
      filtered = filtered.filter(ticket => ticket.precio <= parseFloat(value));
    } else if (name === "entryType" && value) {
      filtered = filtered.filter(ticket => ticket.tipo === value);
    }

    setFilteredTickets(filtered);
  };


  return (
    <>
      <Header />
      <main>
        <header className="tituloEventos">
          <h1>Mercado</h1>
        </header>
        <h2>Filtros</h2>
        <form>
          <div>
            <label>Buscar por nombre:</label>
            <input
              type="text"
              name="search"
              value={search}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label>Precio Mínimo:</label>
            <input
              type="number"
              name="minPrice"
              value={minPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label>Precio Máximo:</label>
            <input
              type="number"
              name="maxPrice"
              value={maxPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label>Tipo de Entrada:</label>
            <select name="entryType" value={entryType} onChange={handleFilterChange}>
              <option value="">Todos</option>
              <option value="VIP">VIP</option>
              <option value="PLATINIUM">PLATINIUM</option>
              <option value="STANDARD">STANDARD</option>
            </select>
          </div>
        </form>
        <h2>Tickets</h2>
        <section className="allListaEventosa">
          {filteredTickets?.map((publicacion) => (
            <PublicacionesBox
              id={publicacion.id}
              foto={publicacion.foto}
              precio={publicacion.precio}
              eventoNombre={publicacion.eventoNombre}
              eventoFecha={publicacion.eventoFecha}
              eventoHora={publicacion.eventoHora}
            />
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
};
