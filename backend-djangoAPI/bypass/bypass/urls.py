from django.urls import URLPattern, path, include
from django.views.generic import RedirectView
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse # Importa HttpResponse

from . import views

def health_check(request):
    return HttpResponse("OK", status=200)

urlpatterns: list[URLPattern] = [
    path('healthz/', health_check), # Opción segura y dedicada
    path('healthz', health_check), # Con o sin barra final
    path('', health_check), # ESTA LÍNEA DEBE IR ANTES DE CUALQUIER OTRA QUE MANEJE LA RAÍZ

    path(route="api/public", view=views.public, name="public"),
    path(route="api/private", view=views.private, name="private"),
    path(route="api/private-scoped", view=views.privateScoped, name="private_scoped"),
    path(route="api/backup", view=views.backup, name="backup"),
    path(route="api/restore", view=views.restore, name="restore"),
    path('admin/', admin.site.urls),
    path('eventos/',include('eventos.urls')),
    path('tickets/',include('tickets.urls')),
    path('usuarios/',include('usuarios.urls')),
    path('transferencia/',include('Transferencia.urls')),
    path('beneficios/',include('beneficios.urls')),
]

#SOLO CUANDO ESTAMOS EN DEBUG-DESARROLLO, NO EN PRODUCCION
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) #Enlazada ambos