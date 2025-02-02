# Backend Django en Google Cloud

Este proyecto es un backend Django que se puede desplegar en Google Cloud. Sigue los pasos a continuación para levantar la base de datos en MySQL y ejecutar el proyecto en tu maquina o servidor.

## Levantar DB en MySQL

### Crear base de datos en MySQL Workbench

1. **Crear el esquema:**
   - Abre MySQL Workbench.
   - Ve a **File** -> **New Query Tab**.
   - Ejecuta el siguiente comando para crear la base de datos:
     ```sql
     CREATE SCHEMA `bypass`;
     ```

2. **Crear un usuario nuevo:**
   - En la pestaña **Administration** de MySQL Workbench, selecciona **Users and Privileges**.
   - Crea un nuevo usuario:
     - **Usuario**: `django_user`
     - **Contraseña**: `django_pass`
   - En la pestaña **Schema Privileges**, selecciona la base de datos `bypass` y otorga todos los privilegios al usuario `django_user`.

---

## Configuración del Backend

### Requisitos

Antes de ejecutar el proyecto, asegúrate de tener Python 3.x y MySQL instalados en tu entorno.

1. **Instalar dependencias:**
   - En tu entorno virtual, ejecuta el siguiente comando para instalar todas las dependencias necesarias:
     ```bash
     pip install -r requirements.txt
     ```

2. **Realizar migraciones:**
   - Ejecuta las migraciones de Django para crear las tablas en la base de datos:
     ```bash
     python manage.py migrate
     ```

3. **Crear superusuario (admin):**
   - Crea un superusuario para acceder al panel de administración de Django:
     ```bash
     python manage.py createsuperuser
     ```
     - **Usuario**: admin
     - **Correo**: admin@admin.com
     - **Contraseña**: admin

4. **Ejecutar el servidor de desarrollo:**
   - Levanta el servidor de desarrollo de Django:
     ```bash
     python manage.py runserver
     ```
   - Esto iniciará el servidor en `http://127.0.0.1:8000/`. Ahora podrás acceder a la API y al panel de administración de Django.

---

## Despliegue en Google Cloud

### Instrucciones para desplegar el proyecto en Google Cloud:

1. **Crear una instancia en Google Compute Engine**.
2. **Configurar la VM** y acceder a ella mediante SSH.
3. **Instalar dependencias** en la VM (según las instrucciones en el paso anterior).
4. **Configurar la base de datos** (puedes usar Cloud SQL para MySQL si lo prefieres).
5. **Ejecutar el servidor** usando `python manage.py runserver 0.0.0.0:8000` para que sea accesible desde la red.

---
