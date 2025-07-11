"""
Django settings for bypass project.

Generated by 'django-admin startproject' using Django 5.0.4.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""
import os
from pathlib import Path

from dotenv import load_dotenv
import pymysql


# Cargo las variables de entorno del archivo .env
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
# SECURITY WARNING: don't run with debug turned on in production! OJO, SI PONEMOS EN FALSE NO SIRVE /MEDIA (para imagenes)
DEBUG = True

# Guardo la url del ngrok
NGROK_URL = os.environ.get('NGROK_URL')
CLIENT_ORIGIN_URL = os.environ.get('CLIENT_ORIGIN_URL')
BACKEND_ORIGIN_URL = os.environ.get('BACKEND_ORIGIN_URL')
# ALLOWED_HOSTS = [
#     'localhost',
#     '127.0.0.1',  # Incluye estas entradas básicas
#     'localhost:4040',
#     '192.168.0.111:4040',
#     NGROK_URL,
#     ]
#     # agregar host de ngrok cada vez que es levantado
ALLOWED_HOSTS = ["*"]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'usuarios',
    'tickets',
    'eventos',
    'Transferencia',
    'coreapi',
    'beneficios'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'utils.middleware.JsonExceptionMiddleware'
]

ROOT_URLCONF = 'bypass.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'bypass.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
pymysql.install_as_MySQLdb()
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_URL = '/media/' #Donde estara ubicada mi media
MEDIA_ROOT = os.path.join(BASE_DIR, "media") #Ruta completa a media

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOWED_ORIGINS = [
    "http://localhost:4040",
    "https://localhost:4040",
    "https://192.168.0.111:4040",
    CLIENT_ORIGIN_URL
    ]

CORS_ALLOW_METHODS = [
    "GET",
    "OPTIONS",
    "POST",
    "PUT",
    "DELETE"
]

CORS_ALLOW_HEADERS = [
    "authorization",
    "content-type",
]

CSRF_COOKIE_SECURE = False

CSRF_TRUSTED_ORIGINS = [
    f"https://{NGROK_URL}",  # Añade tu dominio de Ngrok #ACA
    "http://localhost:8000",  # Añade el host local si lo necesitas
    "https://localhost:8000",  # Añade el host local si lo necesitas
    "http://localhost:80",  # Añade el host local si lo necesitas
    "https://localhost:80",  # Añade el host local si lo necesitas
    "http://35.196.38.34:8000/", #ip vm de google
    CLIENT_ORIGIN_URL,
    BACKEND_ORIGIN_URL
]

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.coreapi.AutoSchema'
}

APPEND_SLASH=True