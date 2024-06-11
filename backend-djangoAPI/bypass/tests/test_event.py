# import datetime
# import pytest
# from django.utils import timezone
# from eventos.models import Lugar, EstadoEvento, Evento

# @pytest.mark.django_db
# def test_event_creation():

#     lugar = Lugar.objects.create(
#         nombre="Lugar de prueba"
#     )

#     estado = EstadoEvento.objects.create(
#         estado="Estado de prueba"
#     )
    
#     evento = Evento.objects.create(
#         nombre="Evento de prueba",
#         fecha=timezone.now(),
#         lugar=lugar,
#         estado=estado

#     )

#     assert evento.nombre == 'Evento de prueba' #Compruebo creacion
#     assert evento.lugar.nombre == 'Lugar de prueba' #Relacion entre entidades
#     assert evento.estado.estado == 'Estado de prueba'