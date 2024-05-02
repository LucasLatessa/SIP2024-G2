import axios from "axios";

const apiServerUrl = "http://127.0.0.1:8000"

const usersAPI = axios.create({
  baseURL: `${apiServerUrl}/usuarios/Usuario/`
})

export const getAllUsers = () => usersAPI.get('/');

export const getUser = (id) => usersAPI.get(`/${id}`);

export const crearTicket = (user) => usersAPI.post('/',user);

