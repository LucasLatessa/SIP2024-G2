from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from eventos import views

router = routers.DefaultRouter()
router.register(r"Eventos",views.EventoView, "eventos")
router.register(r"EstadoEvento",views.EstadoEventoView, "estado_eventos")
router.register(r"Lugar",views.LugarView, "lugar")

urlpatterns = [
    path('', include(router.urls)),
    path('crearEvento/',views.crear_evento,name='crear_evento'),
    path('eventosAprobados/', views.get_eventos_aprobados, name='get_eventos_aprobados'),
    path('byProductora/<int:productora_nickname>', views.get_eventos_productora, name='get_eventos_productora'),
    path('docs/', include_docs_urls(title="Eventos API")),
    path('Evento/<int:pk>/update-state/', views.update_event_state, name='update_event_state'),
    path('Evento/<int:pk>/report/', views.event_report, name='event_report'),
    path('actualizarEvento/<int:pk>/',views.actualizar_evento,name="actualizar_evento")

]