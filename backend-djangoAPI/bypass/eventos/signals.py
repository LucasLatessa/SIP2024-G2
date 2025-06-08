from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import EstadoEvento,Lugar
from tickets.models import TipoTickets,Ticket
from django.db.models.signals import post_migrate
from .models import Productora, Evento
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.files import File
import os
from datetime import datetime
 
#Esta funcion se ejecuta automaticamente despues de que se realicen las migraciones de la base de datos
#Crea tres estados de evento (PENDIENTE, APROBADO, CANCELADO) en la tabla EstadoEvento si no existen
@receiver(post_migrate)
def crear_estados_evento(sender, **kwargs):
    
    estados = [
        'PENDIENTE',
        'APROBADO',
        'CANCELADO'
    ]
    
    for estado in estados:
        EstadoEvento.objects.get_or_create(estado=estado)

#Crea un Lugar
@receiver(post_migrate)
def crear_Lugar(sender, **kwargs):
    Lugar.objects.get_or_create(nombre="Movistar Arena", direccion="Humboldt 450, Cdad. Autónoma de Buenos Aires")

#Crea un evento de prueba en la tabla Eventos
@receiver(post_migrate)
def crear_evento_post_migrate(sender, **kwargs):
    try:
        path_imagen = './Emilia.png'

        # Verifica si la imagen existe
        if os.path.exists(path_imagen):
            with open(path_imagen, 'rb') as imagen_file:
                imagen = File(imagen_file)
                
                # Crear una instancia de Productora (asegúrate de que 'testprodu' exista)
                productora = Productora.objects.get(nickname="testprodu")
                lugar = Lugar.objects.get(id_Lugar=1)
                # Crear el evento
                evento,created = Evento.objects.get_or_create(
                    nombre="Evento de prueba",
                    defaults={
                        "cantTickets":3,
                        "fecha":datetime.strptime("2026-02-02", "%Y-%m-%d").date(),
                        "hora":"21:00",
                        "lugar":lugar,
                        "descripcion":"Prueba",
                        "imagen":imagen,
                        "productora":productora
                    }
                )
                if created:
                    # Crear tickets asociados al evento
                    for tipo_ticket in TipoTickets.objects.all():
                        cantEntradas = 1  # En este caso, asumo que cada tipo tiene 1 entrada
                        precioEntrada = 1  # Puedes ajustar el precio como necesites

                        # Crear los tickets asociados al evento y al tipo
                        for _ in range(cantEntradas):
                            Ticket.objects.create(evento=evento, precioInicial=precioEntrada, tipo_ticket=tipo_ticket)
                
        else:
            print(f"La imagen {path_imagen} no se encuentra en el directorio.")
    except Exception as e:
        print(f"Error al crear el evento y los tickets: {e}")

@receiver(post_migrate)
def aprobar_evento(sender, **kwargs):
    evento = Evento.objects.get(nombre="Evento de prueba")
    # Verificar si el estado actual del evento es "PENDIENTE"
    estado_pendiente = EstadoEvento.objects.get(estado='PENDIENTE')
    if evento.estado == estado_pendiente:
        estado_aprobado = EstadoEvento.objects.get(estado='APROBADO')
        evento.estado = estado_aprobado
        evento.save()
    