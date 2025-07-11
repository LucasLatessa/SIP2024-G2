# Usa una imagen base oficial de Python
FROM python:3.12.3-slim

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y build-essential netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copiar los requirements e instalar
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiar todo el proyecto
COPY . .

# Copiar el entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Comando por defecto
ENTRYPOINT ["/entrypoint.sh"]