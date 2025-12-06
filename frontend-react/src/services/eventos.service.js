import axios from "./axios";

const eventosAPI = axios.create({
  baseURL: `${axios.defaults.baseURL}/eventos`,
});

// ------------------------------- GET -----------------------------------------

export const getAllEventos = () => eventosAPI.get("/Eventos/");


export const getAllEventosAprobados = () =>
  eventosAPI.get("/eventosAprobados/");


//export const getAllEventosAprobados = () => eventosAPI.get("/Eventos/");

export const getEvento = (id) => eventosAPI.get(`/Eventos/${id}/`);

export const getEventReport = (id) => eventosAPI.get(`/Evento/${id}/report/`);

export const getEstadoEvento = (id) => eventosAPI.get(`/EstadoEvento/${id}/`);

export const getEventosByProductora = (id_productora) =>
  eventosAPI.get(`/byProductora/${id_productora}`);

// ------------------------------ POST -----------------------------------------

export const crearEvento = (evento) =>
  eventosAPI.post("/crearEvento/", evento, {
    headers: {
      "Content-Type": "multipart/form-data", //Estamos trabajando con imagenes
    },
  });

// ------------------------------ PUT ------------------------------------------

export const updateState = (id_event, newState) =>
  eventosAPI.put(`/Evento/${id_event}/update-state/`, { state: newState });

export const actualizarEvento = (evento, id) =>
  eventosAPI.put(`/actualizarEvento/${id}/`, evento, {
    headers: {
      "Content-Type": "multipart/form-data", //Estamos trabajando con imagenes
    },
  });
