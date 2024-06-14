# Usa una imagen base oficial de Python
FROM python:3.12.3-slim

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo de requisitos y luego instala las dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código de tu aplicación
COPY . .

# Comando para ejecutar las migraciones y luego la aplicación
CMD ["sh", "-c", "python bypass/manage.py migrate && python bypass/manage.py runserver 0.0.0.0:8000"]