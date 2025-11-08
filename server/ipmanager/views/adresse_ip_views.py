from rest_framework import viewsets
from ipmanager.models import AdresseIP
from ipmanager.serializers import AdresseIPSerializer

class AdresseIPViewSet(viewsets.ModelViewSet):
    queryset = AdresseIP.objects.all().order_by('ip')
    serializer_class = AdresseIPSerializer
