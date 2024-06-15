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
    path('Publicacion/publicas/<int:l>', views.get_all_publication, name='get_all_publication'),
    path('prueba_mercadopago/', views.prueba_mercadopago, name='prueba_mercadopago'),
    path('entregar', views.entregarToken, name='entregarToken'),
    path('byCliente/<int:cliente_id>/', views.get_tickets_by_cliente, name='get_tickets_by_cliente'),
    path('byEvento/<int:evento_id>/', views.get_tickets_by_evento, name='get_tickets_by_evento'),
    path('byEvento/precios/<int:evento_id>/', views.get_tickets_by_evento_min_max, name='get_tickets_by_evento_min_max'),
    path('obtener_precio_entrada/', views.obtener_precio_entrada, name= 'obtener_precio_entrada'),
    path('cambiar_estado_ticket/<int:id_Ticket>/', views.cambiar_estado_ticket, name='cambiar_estado_ticket'),
    path('Publicacion/crear', views.crearPublicacion, name='crear_publicacion'),
    path('Ticket/transferir', views.transferirTicket, name='transferirTicket'),
    path('Publicacion/comprarPublicacion', views.comprarPublicacion, name='comprarPublicacion'),
    path('Publicacion/entregarTicketTpublicacion', views.entregarTicketTpublicacion, name ='entregarTicketTpublicacion')
]
