import React from "react";

import "./Filter.css"

import { useEffect, useState } from "react";

export const EventFiltro = ({ eventos, setFilteredEventos }) => {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  // Aplicar filtro
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

  return (
    <section className="filter">
      <h3 className="tituloFilter">Filtros</h3>
      <form className="formFilter formFilterEvent">
        <label>
          Nombre
          <input
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label>
          Fecha desde
          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </form>
    </section>
  );
};
