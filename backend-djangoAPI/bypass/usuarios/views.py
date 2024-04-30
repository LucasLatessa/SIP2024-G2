from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .serializer import UsuarioSerializer,ClienteSerializer,AdministradorSerializer,ProductoraSerializer
from .models import Usuario,Cliente,Administrador,Productora
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError

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

@csrf_exempt
@api_view(['POST'])
def cliente_create(request):
    my_data = request.data.get("informacion", {})
    nickname = my_data.get("nickname", "")
    nombre = my_data.get("nombre", "")
    apellido = my_data.get("apellido", "")
    correo = my_data.get("correo", "")
    
    # Verificar si ya existe un cliente con el correo electrónico
    cliente_existente = Cliente.objects.filter(correo=correo).first()
    if not(cliente_existente):    
        # Crear un nuevo cliente
        try:
            nuevo_cliente = Cliente.objects.create(
                nickname=nickname,
                nombre=nombre,
                apellido=apellido,
                correo=correo,
                rol='',
                dni=''
            )
            return JsonResponse({'mensaje': 'Cliente creado con éxito'}, status=201)
        except ValidationError as e:
            return JsonResponse({'error': str(e)}, status=400) 
    else:
        return JsonResponse({'mensaje': 'Cliente logueado'}, status=201)