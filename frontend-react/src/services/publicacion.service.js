import axios from "./axios";

// const apiServerUrl = "http://127.0.0.1:8000"
//const apiServerUrl = process.env.REACT_APP_DJANGO_BACKEND

const publicacionAPI = axios.create({
  baseURL: `${axios.defaults.baseURL}/tickets/Publicacion`
})

export const getAllPublicacion1 = () => publicacionAPI.get('/publicas/1');

export const getPublicacion = (id) => publicacionAPI.get(`/${id}`);

export const crearPublicacion = (publicacion) => publicacionAPI.post('/crear',publicacion);

export const crearPreferenciaEvento = ( ticket_publi_id, unit_price, description, vendedor_nickname) => publicacionAPI.post(`/comprarPublicacion`,{ 
  ticket_publi_id: ticket_publi_id, 
  unit_price: unit_price, 
  description: description,
  vendedor_nickname: vendedor_nickname
});
