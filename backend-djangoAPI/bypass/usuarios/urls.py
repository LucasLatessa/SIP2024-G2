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
    path('Usuario/<int:pk>/update-role/', views.update_user_role, name='update_user_role'),
    path('Productora/<int:pk>/report/', views.produ_report, name='produ_report'),
    path('Usuario/create', views.crear_usuario, name='crear_usuario'),
    path('Usuario/updateMP/<str:nn>/', views.updateMP, name='updateMP')
]