from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdresseIPViewSet, DeviceViewSet, NetworkScanView

router = DefaultRouter()
router.register(r'adresses', AdresseIPViewSet)
router.register(r'devices', DeviceViewSet)

urlpatterns = router.urls + [
    path("scan/", NetworkScanView.as_view(), name="network-scan"),
]