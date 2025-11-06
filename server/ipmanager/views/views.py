from rest_framework import viewsets
from .models import AdresseIP, Device
from ipmanager.serializers.serializers import AdresseIPSerializer, DeviceSerializer


class AdresseIPViewSet(viewsets.ModelViewSet):
    queryset = AdresseIP.objects.all()
    serializer_class = AdresseIPSerializer

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
