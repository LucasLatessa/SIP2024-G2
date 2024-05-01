from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import viewsets
from .serializer import TicketSerializer, PublicacionSerializer, PrecioSerializer
from .models import Ticket, Publicacion, Precio

class TicketView(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    queryset = Ticket.objects.all()

class PublicacionView(viewsets.ModelViewSet):
    serializer_class = PublicacionSerializer
    queryset = Publicacion.objects.all()

class PrecioView(viewsets.ModelViewSet):
    serializer_class = PrecioSerializer
    queryset = Precio.objects.all()

def get_all_publication(request):
    # Filtra las publicaciones que estén marcadas como publicas
    publications = Publicacion.objects.filter(publica=True)
    
    # Convierte las publicaciones a un formato JSON
    publication_data = [{'id_Publicacion': publication.id_Publicacion, 
                         'precio': publication.precio, 
                         'fecha': publication.fecha, 
                         'ticket_id': publication.ticket.id_Ticket if publication.ticket else None,
                         'nombre_evento': publication.ticket.evento.nombre if publication.ticket else None} 
                        for publication in publications]

    # Devuelve las publicaciones como una respuesta JSON
    return JsonResponse({'publicaciones': publication_data})