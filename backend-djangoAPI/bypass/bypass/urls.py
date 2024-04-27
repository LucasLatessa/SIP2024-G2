from django.urls import URLPattern, path, include
from django.views.generic import RedirectView
from django.contrib import admin

from . import views

urlpatterns: list[URLPattern] = [
    path(
        route="",
        view=RedirectView.as_view(permanent=False, url="/api/public"),
        name="index",
    ),
    path(route="api/public", view=views.public, name="public"),
    path(route="api/private", view=views.private, name="private"),
    path(route="api/private-scoped", view=views.privateScoped, name="private_scoped"),
    path('admin/', admin.site.urls),
    path('eventos/',include('eventos.urls')),
    path('tickets/',include('tickets.urls')),
    path('usuarios/',include('usuarios.urls')),
    path('transferencia/',include('Transferencia.urls'))
]