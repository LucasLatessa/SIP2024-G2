import axios from "./axios";

// const apiServerUrl = "http://127.0.0.1:8000"
//const apiServerUrl = process.env.REACT_APP_DJANGO_BACKEND

const backupAPI = axios.create({
  baseURL: `${axios.defaults.baseURL}/api`
})

export const crearBackup = () => backupAPI.get('/backup');

export const restore = (db) => backupAPI.post('/restore', db, {
  headers: {
    'Content-Type': 'multipart/form-data' // Estamos trabajando con archivos
  },
  timeout: 10000 // Establecer el timeout a 10 segundos (10000 ms)
});