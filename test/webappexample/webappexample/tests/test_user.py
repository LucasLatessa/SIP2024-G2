import pytest

from apps.usuario.models import Usuario
from apps.event.models import Event

def test_event_creation():
    user= Event.objects.create_event()