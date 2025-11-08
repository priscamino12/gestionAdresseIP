# ipmanager/views.py
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone

from .models import AdresseIP, Device
from .serializers import AdresseIPSerializer, DeviceSerializer
from .network_scanner import scan_network


# -------------------------------
# ViewSets pour CRUD standard
# -------------------------------
class AdresseIPViewSet(viewsets.ModelViewSet):
    """
    Gestion complète des adresses IP via DRF
    """
    queryset = AdresseIP.objects.all().order_by('ip')
    serializer_class = AdresseIPSerializer


class DeviceViewSet(viewsets.ModelViewSet):
    """
    Gestion complète des appareils via DRF
    """
    queryset = Device.objects.all().order_by('-date_connexion')
    serializer_class = DeviceSerializer


# -------------------------------
# API pour le scan réseau
# -------------------------------
class NetworkScanView(APIView):
    """
    GET /api/scan/?network=192.168.1.0/24

    - Ping les IPs du réseau
    - Crée ou met à jour les AdresseIP :
        * IP pingées : actif=True, statut='attribuee' si inconnue, dernière_detection=maintenant
        * IP non pingées : actif=False (sans toucher au statut)
    - Retourne la liste complète (ou seulement les actives si ?only_active=1)
    """
    def get(self, request):
        network = request.query_params.get('network', '192.168.1.0/24')
        only_active = request.query_params.get('only_active') in ('1', 'true', 'True')

        # 🔁 Scan réseau
        active_ips = scan_network(network=network)
        now = timezone.now()

        # ✅ Marque actives (création si inconnues)
        for ip in active_ips:
            addr, created = AdresseIP.objects.get_or_create(
                ip=ip,
                defaults={"statut": "attribuee"}
            )
            addr.actif = True
            addr.derniere_detection = now
            addr.save(update_fields=["actif", "derniere_detection"])

        # ✅ Marque inactives toutes les autres
        AdresseIP.objects.exclude(ip__in=active_ips).update(actif=False)

        # ✅ Retourne les adresses filtrées si nécessaire
        qs = AdresseIP.objects.all().order_by('ip')
        if only_active:
            qs = qs.filter(actif=True)

        data = AdresseIPSerializer(qs, many=True).data
        return Response(data)
