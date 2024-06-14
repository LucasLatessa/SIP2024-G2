# Fase 1: Construcción de la aplicación
FROM node:16 AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Comando para depuración (opcional)
RUN echo "Contenido del directorio /app:" && ls -la /app

# Construir la aplicación para producción
RUN npm run build

# Fase 2: Servir la aplicación con Nginx
FROM nginx:stable-alpine

# Copiar archivos de construcción de la fase anterior
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
