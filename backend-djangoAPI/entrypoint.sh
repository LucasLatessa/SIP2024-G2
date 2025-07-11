#!/bin/sh

# Esperar a que la base de datos este lista
echo "Esperando la base de datos..."
until nc -z $DB_HOST $DB_PORT; do
  sleep 1
done
echo "Base de datos disponible, continuando..."

# Migraciones y collectstatic
cd bypass
python manage.py migrate
python manage.py collectstatic --noinput

# Ejecutar gunicorn

exec gunicorn bypass.wsgi:application --bind 0.0.0.0:8000
