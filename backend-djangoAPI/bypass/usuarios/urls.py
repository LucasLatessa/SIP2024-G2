from django.urls import path, include
from rest_framework import routers
from usuarios import views

router = routers.DefaultRouter()
router.register(r"Usuario",views.UsuarioView)

urlpatterns = [
    path('', include(router.urls))
]
