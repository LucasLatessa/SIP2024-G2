import axios from "axios";

/* PETICIONES A LAS PUBLICACIONES DISPONIBLES EN EL MERCADO */

const apiServerUrl = "http://127.0.0.1:8000"

const publicacionAPI = axios.create({
  baseURL: `${apiServerUrl}/tickets/Publicacion`
})

export const getAllPublicacion = () => publicacionAPI.get('/');

export const getPublicacion = (id) => publicacionAPI.get(`/${id}`);

export const crearPublicacion = (publicacion) => publicacionAPI.post('/crear',publicacion);
