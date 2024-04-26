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