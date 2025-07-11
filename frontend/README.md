# Proyecto SIP2024-G2 — Despliegue con Docker

Este README describe cómo construir y levantar el contenedor Docker para el **frontend (React + Nginx)**.

---

## 📋 Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) instalado
- Opcional: [Docker Compose](https://docs.docker.com/compose/install/) si querés usar `docker-compose.yml`

---

## 🚀 Paso 1: Configurar variables de entorno

En el directorio raíz crea un archivo `.env` con al menos:

```env
REACT_APP_AUTH0_DOMAIN
REACT_APP_AUTH0_CLIENT_ID
REACT_APP_AUTH0_CALLBACK_URL
REACT_APP_AUTH0_AUDIENCE
REACT_APP_DJANGO_BACKEND
REACT_APP_TEST_MERCADOPAGO


```

---

## ⚛️ Paso 2: Construir imagen Docker del frontend

1. Desde el directorio /frontend:

   ```bash
   docker build --tag frontend:latest .
   ```

2. Verificá que la imagen se creó:

   ```bash
   docker images
   ```

---

## 🏃‍♂️ Paso 3: Levantar contenedor (sin Compose)

   ```bash
   docker run -d -p 4040:80 frontend:latest
   ```

> Ahora el frontend esta en `http://localhost:4040`

---

## 🎉 ¡Listo!

Con estos pasos tu aplicación React estará corriendo en Docker.
