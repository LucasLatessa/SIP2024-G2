import axios from "./axios";

// const apiServerUrl = "http://127.0.0.1:8000"
//const apiServerUrl = process.env.REACT_APP_DJANGO_BACKEND

const usersAPI = axios.create({
  baseURL: `${axios.defaults.baseURL}/usuarios/Usuario/`
})
const clientAPI = axios.create({
  baseURL: `${axios.defaults.baseURL}/usuarios/Cliente/`
})
const adminAPI = axios.create({
  baseURL: `${axios.defaults.baseURL}/usuarios/Administrador/`
})
const producAPI = axios.create({
  baseURL: `${axios.defaults.baseURL}/usuarios/Productora/`
})

export const getAllUsers = () => usersAPI.get('/');
export const getAllProdu = () => producAPI.get('/');
export const getUser = (id) => usersAPI.get(`/${id}`);

export const getUserNick = (nickname) => usersAPI.get(`/nick/${nickname}/`);

export const crearUsuario = (user) => usersAPI.post('/create',user);

export const updateClienteMP = (claves) => usersAPI.put(`/updateMP/${claves.user_nn}/`,claves);
export const updateCliente = (user) => clientAPI.put(`/${user.user_id}/`,user);
export const updateAdministrador = (user) =>  adminAPI.put(`/${user.user_id}/`,user);
export const updateProductora = (user) => producAPI.put(`/${user.user_id}/`,user);
export const getProduReport = (id) => producAPI.get(`/${id}/report/`);

export const updateRole = (userId, newRole) => usersAPI.put(`/${userId}/update-role/`, { rol: newRole });