import pytest

from apps.usuario.models import Usuario

def test_user_creation():
    user= Usuario.objects.create_user()