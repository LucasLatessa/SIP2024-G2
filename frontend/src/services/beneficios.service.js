import axios from "./axios";

// const apiServerUrl = "http://127.0.0.1:8000"
//const apiServerUrl = process.env.REACT_APP_DJANGO_BACKEND

const beneficiosAPI = axios.create({
  baseURL: `${axios.defaults.baseURL}/beneficios/Beneficios`
})
const beneficiosCliAPI = axios.create({
  baseURL: `${axios.defaults.baseURL}/beneficios`
})

export const getBeneficiosByCliente = (nickname) => beneficiosCliAPI.get(`/nick/${nickname}`);

export const getBeneficiosByProductora = (nickname) => beneficiosCliAPI.get(`/nickProductora/${nickname}`);

export const deleteBeneficio = (id) => beneficiosCliAPI.put(`/delete/${id}/`);

export const getBeneficio = (id) => beneficiosAPI.get(`/${id}`);

export const crearBeneficio = (beneficio) => beneficiosAPI.post('/',beneficio,{
  headers: {
    'Content-Type': 'multipart/form-data' //Estamos trabajando con imagenes
  }});

