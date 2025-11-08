from rest_framework import viewsets
from ipmanager.models import Device
from ipmanager.serializers import DeviceSerializer

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
