from rest_framework import viewsets
from .serializer import BeneficioSerializer
from .models import Beneficio
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .models import Beneficio
from eventos.models import Evento
from usuarios.models import Cliente
from usuarios.models import Productora
from tickets.models import Ticket

class BeneficioView(viewsets.ModelViewSet):
    serializer_class = BeneficioSerializer
    queryset = Beneficio.objects.all()

@csrf_exempt
@api_view(['POST'])
def crear_beneficio(request):
    try:
        #Serializo el beneficio con los datos del POST
        serializer = BeneficioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() #Creo el beneficio
        return JsonResponse({'mensaje':'Beneficio creado'},status=201)
    except Exception as e:
        return JsonResponse({'error':str(e)},status=400)
    

def getBeneficiosByCliente(request, nickname):
    try:
        cliente = Cliente.objects.get(nickname=nickname)
        eventos = Ticket.objects.filter(propietario=cliente).values_list('evento', flat=True).distinct()
        beneficios = Beneficio.objects.filter(evento__in=eventos, vigente=True)  # Filtrar solo vigentes
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
        return JsonResponse(beneficios_data, safe=False)
    except Cliente.DoesNotExist:
        return JsonResponse({'error': 'Cliente no encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def getBeneficiosByProductora(request, nickname):
    try:
        productora = Productora.objects.get(nickname=nickname)
        id_productora = productora.user_id
        eventos = Evento.objects.filter(productora_id=id_productora)
        beneficios = Beneficio.objects.filter(evento__in=eventos, vigente=True)  # Filtrar solo vigentes
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
        return JsonResponse(beneficios_data, safe=False)
    except Productora.DoesNotExist:
        return JsonResponse({'error': 'Productora no encontrada'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
@api_view(['PUT'])
def eliminar_beneficio(request, id):
    try:
        beneficio = Beneficio.objects.get(id_beneficio=id)
        beneficio.vigente = False
        beneficio.save()
        return JsonResponse({'mensaje': 'Beneficio eliminado (baja lógica)'}, status=200)
    except Beneficio.DoesNotExist:
        return JsonResponse({'error': 'Beneficio no encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)