import axios from "axios";

/* PETICIONES A LOS USUARIOS DEL SISTEMA */

const apiServerUrl = "http://127.0.0.1:8000"

const usersAPI = axios.create({
  baseURL: `${apiServerUrl}/usuarios/Usuario/`
})
const clientAPI = axios.create({
  baseURL: `${apiServerUrl}/usuarios/Cliente/`
})

export const getAllUsers = () => usersAPI.get('/');

export const getUser = (id) => usersAPI.get(`/${id}`);

export const getUserNick = (nickname) => usersAPI.get(`/nick/${nickname}/`);

export const crearCliente = (user) => clientAPI.post('/',user);

export const updateCliente = (user) => clientAPI.put(`/${user.user_id}/`,user);