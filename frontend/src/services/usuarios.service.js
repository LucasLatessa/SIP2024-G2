import axios from "axios";

/* PETICIONES A LOS USUARIOS DEL SISTEMA */

const apiServerUrl = "http://127.0.0.1:8000"

const usersAPI = axios.create({
  baseURL: `${apiServerUrl}/usuarios/Usuario/`
})
const clientAPI = axios.create({
  baseURL: `${apiServerUrl}/usuarios/Cliente/`
})
const adminAPI = axios.create({
  baseURL: `${apiServerUrl}/usuarios/Administrador/`
})
const producAPI = axios.create({
  baseURL: `${apiServerUrl}/usuarios/Productora/`
})

export const getAllUsers = () => usersAPI.get('/');
export const getAllProdu = () => producAPI.get('/');
export const getUser = (id) => usersAPI.get(`/${id}`);

export const getUserNick = (nickname) => usersAPI.get(`/nick/${nickname}/`);

export const crearCliente = (user) => clientAPI.post('/',user);

export const updateCliente = (user) => clientAPI.put(`/${user.user_id}/`,user);
export const updateAdministrador = (user) =>  adminAPI.put(`/${user.user_id}/`,user);
export const updateProductora = (user) => producAPI.put(`/${user.user_id}/`,user);
export const getProduReport = (id) => producAPI.get(`/${id}/report/`);


export const updateRole = (userId, newRole) => usersAPI.put(`/${userId}/update-role/`, { rol: newRole });
/* export const cliente_a_admin = (user_id) => clientAPI.put(`/cliente_a_admin/${user_id}/`);

export const cliente_a_produ = (user_id) => clientAPI.put(`/cliente_a_produ/${user_id}/`); */