# import pytest
# from django.utils import timezone
# from tickets.models import Ticket, Publicacion, Precio

# @pytest.mark.django_db
# def test_ticket_creation():

#     publicacion = Publicacion.objects.create(
#         precio=100.0,
#         fecha=timezone.now(),
#         publica=True
#     )
    
#     precio = Precio.objects.create(
#         precio=100.0,
#         fechaInicial=timezone.now(),
#     )

#     ticket = Ticket.objects.create(
#         precioInicial=200.0,
#     )
#     ticket.publicaciones.add(publicacion)
#     ticket.precios.add(precio)

#     assert ticket.precioInicial == 200.0 
#     assert ticket.publicaciones.first().precio == 100.0
#     assert ticket.precios.first().precio == 100.0