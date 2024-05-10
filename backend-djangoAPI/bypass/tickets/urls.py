from django.urls import path, include
from rest_framework import routers
from tickets import views

router = routers.DefaultRouter()
router.register(r"Ticket",views.TicketView)
router.register(r"Publicacion",views.PublicacionView)
router.register(r"Precio",views.PrecioView)
router.register(r"TipoTicket", views.TipoTicketView)

urlpatterns = [
    path('', include(router.urls)),
    path('obtener_ticket_evento/', views.obtener_ticket_evento, name='comprarTicket'),
    path('publicacion/all/', views.get_all_publication, name='get_all_publication'),
    path('prueba_mercadopago/', views.prueba_mercadopago, name='prueba_mercadopago'),
    path('entregar', views.entregarToken, name='entregarToken'),
    path('byCliente/<int:cliente_id>/', views.get_tickets_by_cliente, name='get_tickets_by_cliente'),

]
