from datetime import datetime
from .models import Usuario,Productora
from django.dispatch import receiver
from django.db.models.signals import post_migrate

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

