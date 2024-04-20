from django.urls import path, include
from rest_framework import routers
from eventos import views

router = routers.DefaultRouter()
router.register(r"Eventos",views.EventoView)
router.register(r"EstadoEvento",views.EstadoEventoView)
router.register(r"Lugar",views.LugarView)

urlpatterns = [
    path('', include(router.urls))
]
