from os import environ #Tiene las variables de entorno del SO
from django.core.exceptions import ImproperlyConfigured #Excepcion si la configuracion no es valida

#Funcion para obtener variables de entorno en Django
def get_env_var(key): #Key -> VARIABLE DE ENTORNO
    try:
        return environ[key]
    except KeyError:
        raise ImproperlyConfigured(f"Missing {key} environment variable.")