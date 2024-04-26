from django.urls import path, include
from rest_framework import routers
from tickets import views

router = routers.DefaultRouter()
router.register(r"Ticket",views.TicketView)
router.register(r"Publicacion",views.PublicacionView)
router.register(r"Precio",views.PrecioView)

urlpatterns = [
    path('', include(router.urls))
]
