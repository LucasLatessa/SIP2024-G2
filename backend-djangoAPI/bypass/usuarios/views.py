from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .serializer import UsuarioSerializer,ClienteSerializer,AdministradorSerializer,ProductoraSerializer
from .models import Usuario,Cliente,Administrador,Productora
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from datetime import datetime

class UsuarioView(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()

class ClienteView(viewsets.ModelViewSet):
    serializer_class = ClienteSerializer
    queryset = Cliente.objects.all()

class AdministradorView(viewsets.ModelViewSet):
    serializer_class = AdministradorSerializer
    queryset = Administrador.objects.all()

class ProductoraView(viewsets.ModelViewSet):
    serializer_class = ProductoraSerializer
    queryset = Productora.objects.all()

def get_cliente_by_dni(request, dni):
    try:
        cliente = Cliente.objects.get(dni=dni)
        cliente_data = {
            'id': cliente.user_id,
            'nickname': cliente.nickname,
            'nombre': cliente.nombre,
            'apellido': cliente.apellido,
            'correo': cliente.correo,
            'rol': cliente.rol,
            'dni': cliente.dni
        }
        return JsonResponse({'cliente': cliente_data})
    except Cliente.DoesNotExist:
        return JsonResponse({'error': 'Cliente no encontrado'}, status=404)

def get_cliente_by_nickname(request, nickname):
    try:
        cliente = Cliente.objects.get(nickname=nickname)
        cliente_data = {
            'user_id': cliente.user_id,
            'nickname': cliente.nickname,
            'nombre': cliente.nombre,
            'apellido': cliente.apellido,
            'correo': cliente.correo,
            'rol': cliente.rol,
            'dni': cliente.dni
        }
        return JsonResponse({'cliente': cliente_data})
    except Cliente.DoesNotExist:
        return JsonResponse({'error': 'Cliente no encontrado'}, status=404)
