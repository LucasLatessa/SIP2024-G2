import axios from "axios";

//const apiServerUrl = process.env.REACT_APP_DJANGO_BACKEND;
//const apiServerUrl = import.meta.env.REACT_APP_DJANGO_BACKEND
const apiServerUrl = import.meta.env.VITE_APP_DJANGO_BACKEND;
console.log(apiServerUrl);

const instance = axios.create({
  baseURL: apiServerUrl,
  timeout: 5000,  // Timeout de 5 segundos
  headers: {
    'Content-Type': 'application/json',
    // Aquí puedes agregar cualquier header común que necesites
  }
});

export default instance;
