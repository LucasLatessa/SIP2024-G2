#!/bin/bash
:'
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

# Clona tu repositorio (reemplaza con tu repo real)
cd /home/lucas
git clone -b deploy https://github.com/LucasLatessa/SIP2024-G2.git
cd SIP2024-G2

sudo apt install python3-venv -y
cd backend-djangoAPI/bypass 
python3 -m venv venv
source venv/bin/activate
# Instala dependencias de Django
pip install -r requirements.txt
# Configura Django (cambia esto según tu proyecto)
python manage.py migrate

# Instala dependencias de React
sudo npm install
'
#sudo lsof -i -P -n

#sudo killall ngrok
#sudo killall python
#bash script.sh > script.log 2>&1 &
#echo $BACKEND_ORIGIN_URL


cd SIP2024-G2/frontend
sudo npm start &

sleep 10

ngrok http 8000 > /dev/null & sleep 2 && export BACKEND_ORIGIN_URL=$(curl -s http://localhost:4041/api/tunnels | jq -r '.tunnels[0].public_url') 
cd ../backend-djangoAPI/bypass
source venv/bin/activate
python manage.py runserver &
deactivate
sudo systemctl start nginx
: '

# Instala y configura Nginx 
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Reinicia Nginx para aplicar la configuración
sudo systemctl restart nginx
'
