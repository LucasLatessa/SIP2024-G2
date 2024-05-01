import axios from "axios";

const apiServerUrl = "http://127.0.0.1:8000"

const ticketsAPI = axios.create({
  baseURL: `${apiServerUrl}/tickets/Tickets`
})

export const getAllTickets = () => ticketsAPI.get('/');

export const getTicket = (id) => ticketsAPI.get(`/${id}`);

export const crearTicket = (ticket) => ticketsAPI.post('/',ticket);

