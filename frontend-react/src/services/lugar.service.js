import axios from "./axios";

// const apiServerUrl = "http://127.0.0.1:8000"
//const apiServerUrl = process.env.REACT_APP_DJANGO_BACKEND

const lugarAPI = axios.create({
  baseURL: `${axios.defaults.baseURL}/eventos/Lugar`
})

export const getAllLugares = () => lugarAPI.get('/');

export const getLugar = (id) => lugarAPI.get(`/${id}`);

export const crearLugar = (lugar) => lugarAPI.post('/',lugar);
