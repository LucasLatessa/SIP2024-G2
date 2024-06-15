import json
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
from eventos.models import Evento
from tickets.models import  Ticket, TipoTickets

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
            'dni': dni,
            'public_key': usuario.Public_Key,
            'access_token': usuario.Access_Token,
            'rol': usuario.rol
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
def updateMP(request, nn):
    try:
        user = Usuario.objects.get(nickname=nn)
        public_key = request.data.get('public_key')
        access_token = request.data.get('access_token')

        user.Public_Key = public_key
        user.Access_Token = access_token
        user.save()
        return JsonResponse({'mensaje': 'Claves cargadas con exito'}, status=200)
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)



@api_view(['PUT'])
#@permission_classes([IsAuthenticated])
def update_user_role(request, pk):
    try:
        user = Usuario.objects.get(pk=pk)
        # Verifica si el usuario autenticado tiene permisos de Administrador
        """try:
            administrador = Administrador.objects.get(user_id=request.user.user_id)
        except Administrador.DoesNotExist:
            return JsonResponse({'error': 'No tienes permisos de administrador'}, status=403)
 """
        # Obtiene el nuevo rol del cuerpo de la solicitud
        new_role = request.data.get('rol')
        # Eliminar el Usuario existente
        user.delete()
        if new_role=="ADMINISTRADOR":
            # Crear un nuevo administrador con los datos del Usuario
            nuevo_admin = Administrador.objects.create(
                nickname=user.nickname,
                nombre=user.nombre,
                apellido=user.apellido,
                correo=user.correo,
                creacion=datetime.now(),
                rol="ADMINISTRADOR"
                #dni=user.dni
            )
        elif new_role=="PRODUCTORA":
            # Crear un nuevo administrador con los datos del Usuario
            nuevo_produ = Productora.objects.create(
                nickname=user.nickname,
                nombre=user.nombre,
                apellido=user.apellido,
                correo=user.correo,
                creacion=datetime.now(),
                rol="PRODUCTORA"
            )
        elif new_role=="CLIENTE":
            # Crear un nuevo cliente con los datos del Usuario
            nuevo_cli = Cliente.objects.create(
                nickname=user.nickname,
                nombre=user.nombre,
                apellido=user.apellido,
                correo=user.correo,
                creacion=datetime.now(),
                rol="CLIENTE"
            )
        return JsonResponse({'mensaje': 'Rol de usuario actualizado con éxito'}, status=200)
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
    

def produ_report(request, pk):
    # Obtener la productora
    try:
        productora = Productora.objects.get(pk=pk)
    except Productora.DoesNotExist:
        return JsonResponse({'error': 'La productora no existe'}, status=404)
    
    # Obtener todos los eventos de la productora
    eventos = Evento.objects.filter(productora=productora)
    
    # Inicializar datos para el reporte
    total_entradas_vendidas = 0
    total_ganancia = 0
    total_asistencia = 0
    eventos_data = []
    
    for evento in eventos:
        tickets = Ticket.objects.filter(evento=evento, propietario__isnull=False)
        tipos_de_tickets = TipoTickets.objects.all()
        entradas_por_tipo = {
            tipo.tipo: tickets.filter(tipo_ticket=tipo).count()
            for tipo in tipos_de_tickets
        }
        entradas_totales = tickets.count()
        ganancia_total = sum(ticket.precioInicial for ticket in tickets)
        asistencia_total = tickets.filter(usada=True).count()
        
        total_entradas_vendidas += entradas_totales
        total_ganancia += ganancia_total
        total_asistencia += asistencia_total
        
        eventos_data.append({
            'evento': evento.nombre,
            'entradas_totales': entradas_totales,
            'entradas_por_tipo': entradas_por_tipo,
            'ganancia_total': ganancia_total,
            'asistencia_total': asistencia_total,
        })
    
    reporte = {
        'productora': productora.nickname,
        'eventos': eventos_data,
        'total_entradas_vendidas': total_entradas_vendidas,
        'total_ganancia': total_ganancia,
        'total_asistencia': total_asistencia,
    }
    
    return JsonResponse(reporte)

@api_view(['POST'])
def crear_usuario(request):
    user = json.loads(request.body)
    # Obtiene el nuevo rol del cuerpo de la solicitud
    role = request.data.get('rol')
    #print(role)
    try:
        if role=="productora":
            # Crear un nuevo administrador con los datos del Usuario
            nuevo_usuario = Productora.objects.create(
                nickname=user.get("nickname"),
                nombre=user.get("nombre"),
                apellido=user.get("apellido"),
                correo=user.get("correo"),
                creacion=datetime.now(),
                rol="PRODUCTORA"
            )
        elif role=="cliente":
            # Crear un nuevo administrador con los datos del Usuario
            nuevo_usuario = Cliente.objects.create(
                nickname=user.get("nickname"),
                nombre=user.get("nombre"),
                apellido=user.get("apellido"),
                correo=user.get("correo"),
                creacion=datetime.now(),
                rol="CLIENTE"
            )
        return JsonResponse({'mensaje': 'Usuario creado con éxito'}, status=200)
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'No se pudo crear el usuario, faltan datos'}, status=404)