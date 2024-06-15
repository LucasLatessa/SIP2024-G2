import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { PublicacionesBox } from "./PublicacionesBox";
import "../Eventos/styles/Eventos.css";
import { getAllPublicacion, getAllPublicacion1} from "../../services/publicacion.service";
import { getEvento } from "../../services/eventos.service";
import { getTicket, getTipoTicket } from "../../services/tickets.service";
import { useEffect, useState } from "react";
import "./styles/marketplace.css";
import axios from "axios";

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
        const res = await getAllPublicacion1();
        const publicacionesConInfoCompleta = await Promise.all(
          res.data.publicaciones.map(async (publicacion) => {
            const ticketRes = await getTicket(publicacion.ticket_id);
            const eventoRes = await getEvento(ticketRes.data.evento);
            const tipoRes = await getTipoTicket(ticketRes.data.tipo_ticket);
            return {
              id: publicacion.id_Publicacion,
              precio: publicacion.precio,
              fecha: publicacion.fecha,
              tipo: tipoRes.data.tipo,
              foto: eventoRes.data.imagen,
              eventoNombre: eventoRes.data.nombre,
              eventoFecha: eventoRes.data.fecha,
              eventoHora: eventoRes.data.hora,
            };
          })
        );
        setPublicaciones(publicacionesConInfoCompleta);
        setFilteredTickets(publicacionesConInfoCompleta);
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
      filtered = filtered.filter((ticket) =>
        ticket.eventoNombre.toLowerCase().includes(value.toLowerCase())
      );
    } else if (name === "minPrice" && value) {
      filtered = filtered.filter(
        (ticket) => ticket.precio >= parseFloat(value)
      );
    } else if (name === "maxPrice" && value) {
      filtered = filtered.filter(
        (ticket) => ticket.precio <= parseFloat(value)
      );
    } else if (name === "entryType" && value) {
      filtered = filtered.filter((ticket) => ticket.tipo === value);
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
              Precio Mínimo:
              <input
                type="number"
                name="minPrice"
                value={minPrice}
                onChange={handleFilterChange}
              />
            </label>
            <label>
              Precio Máximo:
              <input
                type="number"
                name="maxPrice"
                value={maxPrice}
                onChange={handleFilterChange}
              />
            </label>
            <label>
              Tipo de Entrada:
              <select
                name="entryType"
                value={entryType}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="VIP">VIP</option>
                <option value="PLATINIUM">PLATINIUM</option>
                <option value="STANDARD">STANDARD</option>
              </select>
            </label>
          </form>
        </section>
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
