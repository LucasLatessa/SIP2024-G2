from django.urls import path
from . import views

urlpatterns = [
    path('crear_evento/', views.crear_evento, name='crear_evento'),
]