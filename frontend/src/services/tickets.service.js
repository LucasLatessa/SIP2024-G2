import axios from "axios";

/* PETICIONES A LOS TICKETS */

const apiServerUrl = "http://127.0.0.1:8000"

const ticketsAPI = axios.create({
  baseURL: `${apiServerUrl}/tickets/Ticket`
})
const tickets_cliAPI = axios.create({
  baseURL: `${apiServerUrl}/tickets`
})

export const getAllTickets = () => ticketsAPI.get('/');

export const getTicket = (id) => ticketsAPI.get(`/${id}`);

export const crearTicket = (ticket) => ticketsAPI.post('/',ticket);

export const getAllTicketsByCli = (id_cli) => tickets_cliAPI.get(`/byCliente/${id_cli}`);

export const getTicketByEvent = (id_evento) => tickets_cliAPI.get(`/byEvento/${id_evento}`);