import pytest

from apps.user.models import User
from apps.event.models import Event

def test_event_creation(self):
    user= User.objects.first()
    self.client.force_login(user)
    #evento_dict= {'titulo':