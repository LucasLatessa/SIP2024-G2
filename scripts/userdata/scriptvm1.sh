#!/bin/bash

# Actualiza los paquetes y el sistema
sudo apt update && sudo apt upgrade -y

# Instala dependencias esenciales
sudo apt install -y python3 python3-pip python3-venv git curl unzip 

# Instala MySQL Server
sudo apt install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql

# Configura MySQL 
# Acceder a MySQL como root y establecer una contraseña segura para root
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';"

# Crear la base de datos con el nombre especificado en Django
mysql -u root -proot -e "CREATE DATABASE bypass;"

# Crear el usuario para Django con su contraseña
mysql -u root -proot -e "CREATE USER 'django_user'@'%' IDENTIFIED BY 'django_pass';"

# Otorgar permisos completos al usuario sobre la base de datos
mysql -u root -proot -e "GRANT ALL PRIVILEGES ON bypass.* TO 'django_user'@'%';"

# Aplicar los cambios
mysql -u root -proot -e "FLUSH PRIVILEGES;"

# Instala Node.js y npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt install -y nodejs

sudo apt install python3-venv -y
cd ~/backend-djangoAPI/bypass 
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt


# Clona tu repositorio (reemplaza con tu repo real)
cd /home
git clone -b deploy https://github.com/LucasLatessa/SIP2024-G2.git
cd SIP2024-G2

# Instala dependencias de Django
cd backend-djangoAPI/bypass
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configura Django (cambia esto según tu proyecto)
python manage.py migrate

# Inicia el servidor Django en el puerto 8000
nohup python manage.py runserver 0.0.0.0:8000 &

deactivate
# Instala dependencias de React
cd ../../frontend
npm install
npm start
: '
# Instala y configura Nginx (para servir React)
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Configura Nginx para servir el frontend
sudo tee /etc/nginx/sites-available/default > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    
    location / {
        root /home/tu-repo/frontend/build;
        index index.html;
        try_files \$uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Reinicia Nginx para aplicar la configuración
sudo systemctl restart nginx
'
# Abre los puertos en el firewall de Google Cloud
#gcloud compute firewall-rules create allow-http --direction=INGRESS --priority=1000 --network=default --action=ALLOW --rules=tcp:80,tcp:443 --source-ranges=0.0.0.0/0 --target-tags=http-server

#gcloud compute firewall-rules create allow-mysql --direction=INGRESS --priority=1000 --network=default --action=ALLOW --rules=tcp:3306 --source-ranges=0.0.0.0/0 --target-tags=mysql-server

echo "Despliegue completado. Django corriendo en puerto 8000, React en puerto 80."
