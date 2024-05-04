import axios from "axios";

/* PETICIONES A LOS TICKETS */

const apiServerUrl = "http://127.0.0.1:8000"

const ticketsAPI = axios.create({
  baseURL: `${apiServerUrl}/tickets/Ticket`
})

export const getAllTickets = () => ticketsAPI.get('/');

export const getTicket = (id) => ticketsAPI.get(`/${id}`);

export const crearTicket = (ticket) => ticketsAPI.post('/',ticket);

