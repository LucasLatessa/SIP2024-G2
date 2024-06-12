from rest_framework import viewsets
from .serializer import BeneficioSerializer
from .models import Beneficio
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .models import Beneficio
from eventos.models import Evento
from usuarios.models import Cliente
from tickets.models import Ticket

class BeneficioView(viewsets.ModelViewSet):
    serializer_class = BeneficioSerializer
    queryset = Beneficio.objects.all()

@csrf_exempt
@api_view(['POST'])
def crear_beneficio(request):
    try:
        #Serializo el evento con los datos del POST
        serializer = BeneficioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() #Creo el beneficio
        return JsonResponse({'mensaje':'Beneficio creado'},status=201)
    except Exception as e:
        return JsonResponse({'error':str(e)},status=400)
    

def getBeneficiosByCliente(request, nickname):
    try:
        # Obtener el cliente por su nickname
        cliente = Cliente.objects.get(nickname=nickname)
        
        # Obtener los eventos para los cuales el cliente tiene tickets
        eventos = Ticket.objects.filter(propietario=cliente).values_list('evento', flat=True).distinct()
        
        # Obtener los beneficios asociados a esos eventos
        beneficios = Beneficio.objects.filter(evento__in=eventos)
        
        # Serializar los datos
        beneficios_data = [
            {
                'id_beneficio': beneficio.id_beneficio,
                'nombre': beneficio.nombre,
                'descripcion': beneficio.descripcion,
                'porcentajeDescuento': beneficio.porcentajeDescuento,
                'codigoDescuento': beneficio.codigoDescuento,
                'usado': beneficio.usado,
                'imagen': (request.build_absolute_uri(beneficio.imagen.url) if beneficio.imagen else None),
                'evento': beneficio.evento.nombre if beneficio.evento else None,
            }
            for beneficio in beneficios
        ]
        
        return JsonResponse(beneficios_data, safe = False)
    
    except Cliente.DoesNotExist:
        return JsonResponse({'error': 'Cliente no encontrado'}, status=404)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)