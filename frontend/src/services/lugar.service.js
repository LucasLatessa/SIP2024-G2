import axios from "./axios";

// const apiServerUrl = "http://127.0.0.1:8000"
//const apiServerUrl = process.env.REACT_APP_DJANGO_BACKEND

const lugarAPI = axios.create({
  baseURL: `${axios.defaults.baseURL}/eventos/Lugar`
})

export const getAllLugares = (token) => lugarAPI.get('/', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export const crearLugar = (lugar, token) =>lugarAPI.post("/", lugar, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
