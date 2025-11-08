from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone

from ipmanager.models import AdresseIP
from ipmanager.serializers import AdresseIPSerializer
from ipmanager.network_scanner import scan_network

class NetworkScanView(APIView):
    """
    Met à jour actif=True/False selon le scan,
    mais retourne TOUTES les adresses IP en base.
    """
    def get(self, request):
        network = request.query_params.get("network", "192.168.1.0/24")
        active_ips = scan_network(network=network)
        now = timezone.now()

        for ip in active_ips:
            addr, created = AdresseIP.objects.get_or_create(
                ip=ip,
                defaults={"statut": "attribuee"}
            )
            addr.actif = True
            addr.derniere_detection = now
            addr.save()

        AdresseIP.objects.exclude(ip__in=active_ips).update(actif=False)

        all_ips = AdresseIP.objects.all().order_by("ip")
        return Response(AdresseIPSerializer(all_ips, many=True).data)
