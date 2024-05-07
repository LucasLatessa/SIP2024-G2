from django.urls import path, include
from rest_framework import routers
from usuarios import views

router = routers.DefaultRouter()
router.register(r"Usuario",views.UsuarioView)
router.register(r"Cliente",views.ClienteView)
router.register(r"Administrador",views.AdministradorView)
router.register(r"Productora",views.ProductoraView)
urlpatterns = [
    path('', include(router.urls)),
    path('Usuario/nick/<str:nickname>/', views.get_cliente_by_nickname, name='get_cliente_by_nickname'),
    path('<str:dni>/', views.get_cliente_by_dni, name='get_cliente_by_dni'),
]
