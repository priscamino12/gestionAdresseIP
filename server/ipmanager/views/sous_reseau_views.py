from rest_framework import viewsets
from ipmanager.models import SousReseau
from ipmanager.serializers import SousReseauSerializer

class SousReseauViewSet(viewsets.ModelViewSet):
    queryset = SousReseau.objects.all()
    serializer_class = SousReseauSerializer
