import axios from "axios";

const apiServerUrl = "http://127.0.0.1:8000"

const beneficiosAPI = axios.create({
  baseURL: `${apiServerUrl}/beneficios/Beneficios`
})

export const getAllBeneficios = () => beneficiosAPI.get('/');

export const getBeneficio = (id) => beneficiosAPI.get(`/${id}`);

export const crearBeneficio = (beneficio) => beneficiosAPI.post('/',beneficio,{
  headers: {
    'Content-Type': 'multipart/form-data' //Estamos trabajando con imagenes
  }});