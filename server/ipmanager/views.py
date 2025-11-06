# ipmanager/views.py

from rest_framework import viewsets
from .models import AdresseIP, Device
from .serializers import AdresseIPSerializer, DeviceSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .network_scanner import scan_network


class AdresseIPViewSet(viewsets.ModelViewSet):
    queryset = AdresseIP.objects.all()
    serializer_class = AdresseIPSerializer

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
class NetworkScanView(APIView):
    def get(self, request):
        active_ips = scan_network()  # Scanne le réseau

        data = []
        for ip in active_ips:
            # On ajoute en base si pas encore enregistré
            addr, _ = AdresseIP.objects.get_or_create(
                ip=ip,
                defaults={"statut": "attribuee"}
            )

            data.append({
                "id": addr.id,
                "ip": addr.ip,
                "statut": addr.statut
            })

        return Response(data)