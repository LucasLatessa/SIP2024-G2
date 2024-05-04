from rest_framework import viewsets
from .serializer import BeneficioSerializer
from .models import Beneficio
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.http import JsonResponse

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