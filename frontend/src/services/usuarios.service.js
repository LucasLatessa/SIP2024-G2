import axios from "axios";

/* PETICIONES A LOS USUARIOS DEL SISTEMA */

const apiServerUrl = "http://127.0.0.1:8000"

const usersAPI = axios.create({
  baseURL: `${apiServerUrl}/usuarios/Usuario/`
})

export const getAllUsers = () => usersAPI.get('/');

export const getUser = (id) => usersAPI.get(`/${id}`);

export const crearUsuario = (user) => usersAPI.post('/',user);