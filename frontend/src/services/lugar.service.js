//import { callExternalApi } from "./external-api.service";
import axios from "axios";

const apiServerUrl = "http://127.0.0.1:8000"

const lugarAPI = axios.create({
  baseURL: `${apiServerUrl}/eventos/Lugar`
})

export const getAllLugares = () => lugarAPI.get('/');

export const getLugar = (id) => lugarAPI.get(`/${id}`);

export const crearLugar = (lugar) => lugarAPI.post('/',lugar);
