import os
import shutil
from datetime import datetime
from django.conf import settings


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
