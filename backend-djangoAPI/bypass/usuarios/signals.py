from datetime import datetime
from django.contrib.auth import get_user_model
from .models import Usuario,Productora,Administrador,Cliente
from django.dispatch import receiver
from django.db.models.signals import post_migrate


#Crea un superusuario
@receiver(post_migrate)
def crear_superusuario(sender, **kwargs):
    User = get_user_model()
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser(
            username="admin",
            email="admin@exaadminmple.com",
            password="admin"
        )


#Crea una Productora
@receiver(post_migrate)
def crear_Productora(sender, **kwargs):
    productora, created = Productora.objects.get_or_create(
        nickname="testprodu",
        defaults={
            "nombre": "test",
            "apellido": "produ",
            "correo": "testprodu@exaple.com",
            "creacion": datetime.now(),
            "rol": "PRODUCTORA"
        }
    )

#Crea un Administrador
@receiver(post_migrate)
def crear_Administrador(sender, **kwargs):
    admin, created = Administrador.objects.get_or_create(
        nickname="bypasssip",
        defaults={
            "nombre": "ByPass",
            "apellido": "",
            "correo": "bypasssip@gmail.com",
            "creacion": datetime.now(),
            "rol": "ADMINISTRADOR"
        }
    )

#Crea un Cliente   
@receiver(post_migrate)
def crear_Cliente(sender, **kwargs):
    cliente, created = Cliente.objects.get_or_create(
        nickname="cliente",
        defaults={
            "nombre": "cliente",
            "apellido": "",
            "correo": "cliente@example.com",
            "creacion": datetime.now(),
            "rol": "CLIENTE"
        }
    )


