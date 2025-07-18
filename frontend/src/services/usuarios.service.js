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

export const getAllUsers = (token) =>
  usersAPI.get("/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
export const getAllProdu = (token) => producAPI.get("/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
export const getUserNick = (nickname) => usersAPI.get(`/nick/${nickname}/`);

export const crearUsuario = (user) => usersAPI.post('/create',user);

export const updateCliente = (user, token) =>
  clientAPI.put(`/${user.user_id}/`, user, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAdministrador = (user, token) =>
  adminAPI.put(`/${user.user_id}/`, user, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProductora = (user, token) =>
  producAPI.put(`/${user.user_id}/`, user, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getProduReport = (id) => producAPI.get(`/${id}/report/`);

export const updateRole = (userId, newRole, token) =>
  usersAPI.put(`/${userId}/update-role/`, { rol: newRole }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
/* export const cliente_a_admin = (user_id) => clientAPI.put(`/cliente_a_admin/${user_id}/`);

export const cliente_a_produ = (user_id) => clientAPI.put(`/cliente_a_produ/${user_id}/`); */