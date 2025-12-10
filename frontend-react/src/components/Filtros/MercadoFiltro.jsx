import React from "react";

import "./Filter.css"

import { useEffect, useState } from "react";

export const MercadoFiltro = ({ tickets, setFilteredTickets }) => {
  const [search, setSearch] = useState("");
  const [entryType, setEntryType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Aplicar filtro
  const applyFilters = () => {
    let filtered = tickets;

    if (search) {
      filtered = filtered.filter((ticket) =>
        ticket.eventoNombre.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (minPrice) {
      filtered = filtered.filter(
        (ticket) => ticket.precio >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      filtered = filtered.filter(
        (ticket) => ticket.precio <= parseFloat(maxPrice)
      );
    }
    if (entryType) {
      filtered = filtered.filter((ticket) => ticket.tipo === entryType);
    }
    setFilteredTickets(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [search, entryType, maxPrice, minPrice, tickets]);

  return (
    <section className="filter filterMercado">
      <h3 className="tituloFilter">Filtros</h3>
      <form className="formFilter formFilterMercado">
        <label>
          Nombre del evento
          <input
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label>
          Precio minimo
          <input
            type="number"
            name="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </label>
        <label>
          Precio maximo
          <input
            type="number"
            name="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </label>
        <label>
          Tipo de Entrada
          <select
            name="entryType"
            value={entryType}
            onChange={(e) => setEntryType(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="VIP">VIP</option>
            <option value="PLATINIUM">PLATINIUM</option>
            <option value="STANDARD">STANDARD</option>
          </select>
        </label>
      </form>
    </section>
  );
};
