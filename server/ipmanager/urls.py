from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdresseIPViewSet, DeviceViewSet, NetworkScanView, SousReseauViewSet

router = DefaultRouter()
router.register("adresses", AdresseIPViewSet)
router.register("devices", DeviceViewSet)
router.register("sous-reseaux", SousReseauViewSet, basename='sous-reseau')


urlpatterns = router.urls + [
    path("scan/", NetworkScanView.as_view(), name="network-scan"),
    path("", include(router.urls)),
]

