from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .serializer import UsuarioSerializer,ClienteSerializer,AdministradorSerializer,ProductoraSerializer
from .models import Usuario,Cliente,Administrador,Productora
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

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


def get_usuario_by_nickname(request, nickname):
    try:
        usuario = Usuario.objects.get(nickname=nickname)

        # Verificar si el usuario es un cliente o administrador y recuperar el campo 'dni' si corresponde 
        try:
            cli = Cliente.objects.get(nickname=nickname)
            dni = cli.dni
        except Cliente.DoesNotExist:
            dni = None
    
        try:
            adm = Administrador.objects.get(nickname=nickname)
            dni = adm.dni
        except Administrador.DoesNotExist:
            pass
    
        usuario_data = {
            'user_id': usuario.user_id,
            'nickname': usuario.nickname,
            'nombre': usuario.nombre,
            'apellido': usuario.apellido,
            'correo': usuario.correo,
            'dni': dni
        }
        return JsonResponse({'usuario': usuario_data})
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

@csrf_exempt
@api_view(['PUT'])
def update_cliente(request, cliente_id):
    # Obtener el cliente existente por su ID
    try:
        cliente = Cliente.objects.get(user_id=cliente_id)
    except Cliente.DoesNotExist:
        return JsonResponse({'error': 'Cliente no encontrado'}, status=404)
    
    # Obtener los datos actualizados del cliente del cuerpo de la solicitud
    my_data = request.data.get("informacion", {})
    nickname = my_data.get("nickname", cliente.nickname)
    nombre = my_data.get("nombre", cliente.nombre)
    apellido = my_data.get("apellido", cliente.apellido)
    correo = my_data.get("correo", cliente.correo)
    dni = my_data.get("dni", cliente.dni)

    print(dni)
    print(apellido)
    # Actualizar los campos del cliente con los nuevos datos
    cliente.user_id = cliente_id
    cliente.nickname = nickname
    cliente.nombre = nombre
    cliente.apellido = apellido
    cliente.correo = correo
    cliente.dni = dni

    # Guardar los cambios en la base de datos
    cliente.save()
    # Devolver la respuesta con el cliente actualizado
    cliente_data = {
        'id': cliente_id,
        'nickname': cliente.nickname,
        'nombre': cliente.nombre,
        'apellido': cliente.apellido,
        'correo': cliente.correo,
        'dni': cliente.dni
    }
    return JsonResponse({'cliente': cliente_data})

@api_view(['PUT'])
#@permission_classes([IsAuthenticated])
def update_user_role(request, pk):
    try:
        user = Usuario.objects.get(pk=pk)
        # Verifica si el usuario autenticado tiene permisos de Administrador
        """ try:
            administrador = Administrador.objects.get(user_id=request.user.user_id)
        except Administrador.DoesNotExist:
            return JsonResponse({'error': 'No tienes permisos de administrador'}, status=403)
 """
        # Obtiene el nuevo rol del cuerpo de la solicitud
        new_role = request.data.get('rol')
        # Eliminar el cliente existente
        user.delete()
        if new_role=="Administrador":
            # Crear un nuevo administrador con los datos del cliente
            nuevo_admin = Administrador.objects.create(
                nickname=user.nickname,
                nombre=user.nombre,
                apellido=user.apellido,
                correo=user.correo,
                creacion=datetime.now(),
                #dni=user.dni
            )
        elif new_role=="Productora":
            # Crear un nuevo administrador con los datos del cliente
            nuevo_produ = Productora.objects.create(
                nickname=user.nickname,
                nombre=user.nombre,
                apellido=user.apellido,
                correo=user.correo,
                creacion=datetime.now(),
            )
        return JsonResponse({'mensaje': 'Rol de usuario actualizado con éxito'}, status=200)
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)