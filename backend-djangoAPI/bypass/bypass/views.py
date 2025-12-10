from django.http import HttpRequest, JsonResponse
from utils.authorization import RequestToken, authorized, can, getRequestToken
from utils.backup import backup_db


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
    passw = request.GET.get("passw", "")
    if ( passw == '402051f4be0cc3aad33bcf3ac3d6532b' ):
        backupaux = backup_db()

        if (backupaux == 'realizado'):
            return JsonResponse({"backup": 'realizado'})
        else:
            return JsonResponse({"backup": 'fallido'})
    else:
        return JsonResponse({"backup": 'Contrasena incorrecta'})
        
    