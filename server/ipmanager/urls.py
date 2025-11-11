# ipmanager/urls.py
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AdresseIPViewSet, DeviceViewSet, NetworkScanView, SousReseauViewSet

router = DefaultRouter()
router.register("adresses", AdresseIPViewSet)
router.register("devices", DeviceViewSet)
router.register("sous-reseaux", SousReseauViewSet, basename='sous-reseau')

urlpatterns = [
    path("scan/", NetworkScanView.as_view(), name="network-scan"),
]

urlpatterns += router.urls
