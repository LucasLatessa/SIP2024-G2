from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .serializer import UsuarioSerializer,ClienteSerializer,AdministradorSerializer,ProductoraSerializer
from .models import Usuario,Cliente,Administrador,Productora

class UsuarioView(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()

class ClienteView(viewsets.ModelViewSet):
    serializer_class = ClienteSerializer
    queryset = Cliente.objects.all()

class Administradoriew(viewsets.ModelViewSet):
    serializer_class = AdministradorSerializer
    queryset = Administrador.objects.all()

class ProductoraView(viewsets.ModelViewSet):
    serializer_class = ProductoraSerializer
    queryset = Productora.objects.all()

def get_all_clientes(request):
    clientes = Cliente.objects.all()
    clientes_data = [{
        'id': cliente.user_id,
        'nickname': cliente.nickname,
        'nombre': cliente.nombre,
        'apellido': cliente.apellido,
        'correo': cliente.correo,
        'rol': cliente.rol,
        'dni': cliente.dni
    } for cliente in clientes]
    return JsonResponse({'clientes': clientes_data})

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