from django.urls import path, include
from rest_framework import routers
from usuarios import views

router = routers.DefaultRouter()
router.register(r"Usuario",views.UsuarioView)

urlpatterns = [
    path('', include(router.urls)),
    path('clientes/all/', views.get_all_clientes, name='get_all_clientes'),
    path('clientes/create/', views.cliente_create, name='cliente_create'),
    path('clientes/update/<str:cliente_id>/', views.update_cliente, name='update_cliente'),
    path('clientes/<str:nickname>/', views.get_cliente_by_nickname, name='get_cliente_by_nickname'),
    path('<str:dni>/', views.get_cliente_by_dni, name='get_cliente_by_dni'),
    path('clientes/entregar', views.entregarToken, name='entregarToken'),
]
