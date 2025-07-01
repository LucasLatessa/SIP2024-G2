from django.http import HttpRequest, JsonResponse
from utils.authorization import RequestToken, authorized, can, getRequestToken
from utils.backup import backup_db,restore_db
from rest_framework.decorators import api_view
from django.core.files.storage import default_storage


def public(request: HttpRequest) -> JsonResponse:

    return JsonResponse(
        data={
            "message": "Hello from a public endpoint! You don't need to be authenticated to see this.",
        }
    )


@authorized
def private(request: HttpRequest, token: RequestToken) -> JsonResponse:
    return JsonResponse(
        data={
            "message": "Hello from a private endpoint! You need to be authenticated to see this.",
            "token": token.dict(),
        }
    )


@can("read:admin-messages")
def privateScoped(request: HttpRequest, token: RequestToken) -> JsonResponse:
    return JsonResponse(
        data={
            "message": "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.",
            "token": token.dict(),
        }
    )

def backup(request):
    backupaux = backup_db()
    if (backupaux == 'realizado'):
        return JsonResponse({"backup": 'realizado'})
    else:
        return JsonResponse({"backup": 'fallido'})

@api_view(["POST"])
def restore(request):
    backup_file = request.FILES['backup_file']
    # Guardar el archivo temporalmente en el servidor
    backup_file_path = default_storage.save(backup_file.name, backup_file)
    # Obtener la ruta completa del archivo guardado
    backup_file_full_path = default_storage.path(backup_file_path)
    # Restaurar la base de datos con el archivo
    restoreaux = restore_db(backup_file_full_path)
    # Eliminar el archivo después de restaurar
    default_storage.delete(backup_file_path)
    if (restoreaux == 'realizado'):
        return JsonResponse({"restore": 'realizado'})
    else:
        return JsonResponse({"restore": 'fallido'})
    