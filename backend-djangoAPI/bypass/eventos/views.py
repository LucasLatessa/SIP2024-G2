from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .serializer import EventoSerializer, EstadoEventoSerializer, LugarSerializer
from .models import Evento, EstadoEvento, Lugar


class EventoView(viewsets.ModelViewSet):
    serializer_class = EventoSerializer
    queryset = Evento.objects.all()

class EstadoEventoView(viewsets.ModelViewSet):
    serializer_class = EstadoEventoSerializer
    queryset = EstadoEvento.objects.all()

class LugarView(viewsets.ModelViewSet):
    serializer_class = LugarSerializer
    queryset = Lugar.objects.all()
def get_all_events(request):
    # Recupera todos los usuarios de la base de datos
    events = Evento.objects.all()

    # Convierte los usuarios a un formato JSON
    event_data = [{'id_Evento': event.id_Evento, 'nombre': event.nombre, 'fecha': event.fecha} for event in events]

    # Devuelve los usuarios como una respuesta JSON
    return JsonResponse({'eventos': event_data})