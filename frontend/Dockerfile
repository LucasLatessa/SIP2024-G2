# Etapa de construcción: construye la aplicación React
FROM node:14.18.0-alpine as build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración de la aplicación (package.json, package-lock.json)
COPY package*.json ./

# Instala las dependencias
RUN npm install --silent

# Copia el código de la aplicación
COPY . .

# Construye la aplicación React optimizada para producción
RUN npm run build

# Etapa de producción: sirve la aplicación construida en un servidor web Nginx
FROM nginx:1.21.4-alpine

# Copia los archivos construidos desde la etapa de construcción al servidor Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Configura Nginx para servir la aplicación React en el puerto 4040
RUN echo " \
    server { \
        listen       4040; \
        server_name  localhost; \
        root   /usr/share/nginx/html; \
        index  index.html index.htm; \
        try_files $uri $uri/ /index.html; \
        }" > /etc/nginx/conf.d/default.conf

# Expone el puerto 4040 para que la aplicación sea accesible desde afuera del contenedor
EXPOSE 4040

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
