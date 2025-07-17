import os
import shutil
from datetime import datetime
from django.conf import settings
from django.http import HttpResponse
import subprocess
import glob


def backup_db():
    db_settings = settings.DATABASES['default']
    db_name = db_settings['NAME']
    db_user = db_settings['USER']
    db_password = db_settings['PASSWORD']
    db_host = db_settings['HOST']
    db_port = db_settings.get('PORT', '3306')

    # Obtener ruta de mysqldump desde el PATH del sistema
    mysqldump_path = shutil.which("mysqldump")
    if not mysqldump_path:
        return HttpResponse("mysqldump no encontrado en el sistema", status=500)

    # Preparar el entorno para ocultar el password
    env = os.environ.copy()
    env["MYSQL_PWD"] = db_password  # Evita mostrar la clave en el comando

    # Armar el comando mysqldump
    dump_command = [
        mysqldump_path,
        "-h", db_host,
        "-P", db_port,
        "-u", db_user,
        db_name
    ]

    try:
        # Ejecutar mysqldump y capturar salida
        result = subprocess.run(
            dump_command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=env,
            check=True
        )

        # Preparar la respuesta HTTP con el archivo
        response = HttpResponse(result.stdout, content_type='application/sql')
        date_str = datetime.now().strftime("%Y%m%d%H%M")
        filename = f"backup_{date_str}.sql"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response

    except subprocess.CalledProcessError as e:
        return HttpResponse(f"Error al realizar backup: {e.stderr.decode()}", status=500)
    
def restore_db(backup_file):
    db_settings = settings.DATABASES['default']
    db_name = db_settings['NAME']
    db_user = db_settings['USER']
    db_password = db_settings['PASSWORD']
    db_host = db_settings['HOST']
    db_port = db_settings.get('PORT', '3306')

    mysql_path = get_mysql_path()

    restore_command = f'"{mysql_path}" -h {db_host} -P {db_port} -u {db_user} -p{db_password} {db_name} < "{backup_file}"'

    try:
        subprocess.run(restore_command, shell=True, check=True)
        return "realizado"
    except Exception as e:
        return 'error'

def get_mysql_path():
    mysql_path = shutil.which("mysql")
    if not mysql_path:
        raise FileNotFoundError("No se encontro el ejecutable 'mysql' en el PATH del sistema.")
    return mysql_path


"""
#Para SQLite

 def backup_db():
    db_settings = settings.DATABASES['default']
    db_name = db_settings['NAME']
    backup_path = 'C:\\Users\\Santiago\\Desktop\\backup'

    os.makedirs(backup_path, exist_ok=True)

    date_str = datetime.now().strftime("%Y%m%d%H%M")

    backup_file = os.path.join(backup_path, f"backup_{date_str}.sqlite3")

    try:
        shutil.copy(db_name, backup_file)
        return 'realizado'
    except Exception as e:
        return 'error'
 """