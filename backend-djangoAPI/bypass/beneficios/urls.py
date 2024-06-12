from django.urls import path, include
from rest_framework import routers
from beneficios import views

router = routers.DefaultRouter()
router.register(r"Beneficios",views.BeneficioView, "beneficios")

urlpatterns = [
    path('', include(router.urls)),
    path('crearBeneficio/',views.crear_beneficio,name='crear_beneficio'),
    path('nick/<str:nickname>/', views.getBeneficiosByCliente, name='getBeneficiosByCliente'),
    path('nickProductora/<str:nickname>/', views.getBeneficiosByProductora, name='getBeneficiosByProductora'),
    path('delete/<int:id>/', views.eliminar_beneficio, name='eliminar_beneficio')
]