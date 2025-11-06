from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdresseIPViewSet, DeviceViewSet

router = DefaultRouter()
router.register(r'adresses', AdresseIPViewSet)
router.register(r'devices', DeviceViewSet)

urlpatterns = router.urls
