from django.db.models.signals import post_migrate
from django.dispatch import receiver
from tickets.models import TipoTickets
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import   TipoTickets

#Esta funcion se ejecuta automaticamente despues de que se realicen las migraciones de la base de datos
#Crea tres tipos de ticket(STANDARD, VIP, PLATINIUM) en la tabla TipoTicket si no existen
@receiver(post_migrate)
def crear_tipo_tickets(sender, **kwargs):
    
    tipos = [
        'STANDARD',
        'VIP',
        'PLATINIUM'
    ]
    
    for tipo in tipos:
        TipoTickets.objects.get_or_create(tipo=tipo)