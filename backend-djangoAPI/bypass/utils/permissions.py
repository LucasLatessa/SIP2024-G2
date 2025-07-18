from rest_framework.permissions import BasePermission
from utils.authorization import getRequestToken, RequestToken
from utils.middleware import JsonException

class IsAuthenticatedCustom(BasePermission):
    def has_permission(self, request, view):
        token: RequestToken | None = getRequestToken(request, mutateRequest=True)
        return token is not None and token.isAuthorized()


class HasScopePermission(BasePermission):
    def __init__(self, scope_required):
        self.scope_required = scope_required

    def has_permission(self, request, view):
        token: RequestToken | None = getRequestToken(request, mutateRequest=True)
        if token is None or not token.isAuthorized():
            return False
        return token.hasPermission(self.scope_required)
