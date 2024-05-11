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
    path('Usuario/nick/<str:nickname>/', views.get_usuario_by_nickname, name='get_usuario_by_nickname'),
    path('cliente_a_admin/<int:cliente_id>/', views.cliente_a_admin, name='cliente_a_admin'),
]
