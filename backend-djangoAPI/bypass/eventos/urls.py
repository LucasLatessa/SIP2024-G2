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
    path('all/', views.get_all_events, name='get_all_events'),
    path('docs/', include_docs_urls(title="Eventos API"))
]
