import os
import shutil
from datetime import datetime
from django.conf import settings
import subprocess
import glob

def backup_db():
    db_settings = settings.DATABASES['default']
    db_name = db_settings['NAME']
    db_user = db_settings['USER']
    db_password = db_settings['PASSWORD']
    db_host = db_settings['HOST']
    db_port = db_settings.get('PORT', '3306')  # Puerto por defecto de MySQL

    # Obtener la carpeta del escritorio de cualquier usuario
    desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
    backup_path = os.path.join(desktop_path, "backup")
    os.makedirs(backup_path, exist_ok=True)

    date_str = datetime.now().strftime("%Y%m%d%H%M")
    backup_file = os.path.join(backup_path, f"backup_{date_str}.sql")
    mysqldump_path=get_mysqldump_path()
    # Comando mysqldump
    dump_command = f'"{mysqldump_path}" -h {db_host} -P {db_port} -u {db_user} -p{db_password} {db_name} > "{backup_file}"'

    try:
        subprocess.run(dump_command, shell=True, check=True)
        return 'realizado'
    except Exception as e:
        return 'error'
    
def get_mysqldump_path():
    base_path = r"C:\Program Files\MySQL"
    mysql_folders = glob.glob(os.path.join(base_path, "MySQL Server *"))

    if not mysql_folders:
        raise FileNotFoundError("No se encontró una instalación de MySQL Server en 'C:\\Program Files\\MySQL'.")

    # Tomar la versión más reciente (última en la lista ordenada)
    mysql_folders.sort(reverse=True)  
    mysql_bin_path = os.path.join(mysql_folders[0], "bin", "mysqldump.exe")

    if not os.path.exists(mysql_bin_path):
        raise FileNotFoundError(f"No se encontró mysqldump en '{mysql_bin_path}'.")

    return mysql_bin_path

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
    base_path = r"C:\Program Files\MySQL"
    mysql_folders = glob.glob(os.path.join(base_path, "MySQL Server *"))

    if not mysql_folders:
        raise FileNotFoundError("No se encontró una instalación de MySQL Server en 'C:\\Program Files\\MySQL'.")

    # Tomar la versión más reciente (última en la lista ordenada)
    mysql_folders.sort(reverse=True)  
    mysql_bin_path = os.path.join(mysql_folders[0], "bin", "mysql.exe")

    if not os.path.exists(mysql_bin_path):
        raise FileNotFoundError(f"No se encontró mysql.exe en '{mysql_bin_path}'.")

    return mysql_bin_path


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