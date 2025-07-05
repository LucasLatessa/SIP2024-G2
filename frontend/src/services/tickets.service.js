import axios from "./axios";

// const apiServerUrl = "http://127.0.0.1:8000"
//const apiServerUrl = process.env.REACT_APP_DJANGO_BACKEND

const ticketsAPI = axios.create({
  baseURL: `${axios.defaults.baseURL}/tickets/Ticket`
})
const tickets_cliAPI = axios.create({
  baseURL: `${axios.defaults.baseURL}/tickets`
})

export const getAllTickets = () => ticketsAPI.get('/');

export const getTicket = (id) => ticketsAPI.get(`/${id}/`);

export const crearTicket = (ticket) => ticketsAPI.post('/',ticket);

export const getAllTicketsByCli = (id_cli) => tickets_cliAPI.get(`/byCliente/${id_cli}`);

export const getTicketByEvent = (id_evento) => tickets_cliAPI.get(`/byEvento/${id_evento}`);

export const preferenciaTransferencia = (id_ticket,costoTransferencia,nuevoPropietario) => ticketsAPI.put(`/preferencia_transferir`, {
  id_ticket:id_ticket,
  costoTransferencia:costoTransferencia,
  nuevoPropietario:nuevoPropietario
});
export const getTicketByEventPrecio = (id_evento) => tickets_cliAPI.get(`/byEvento/precios/${id_evento}`);

export const cambiarEstadoTicket = (id) => tickets_cliAPI.put(`/cambiar_estado_ticket/${id}/`);

export const getTipoTicket = (id) => tickets_cliAPI.get(`TipoTicket/${id}/`);

