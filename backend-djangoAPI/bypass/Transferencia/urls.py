from django.urls import path, include
from rest_framework import routers
from Transferencia import views

router = routers.DefaultRouter()
router.register(r"Transferencia",views.TransferenciaView)

urlpatterns = [
    path('', include(router.urls))
]
