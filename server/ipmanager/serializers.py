from rest_framework import serializers
from .models import AdresseIP, Device


class AdresseIPSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdresseIP
        fields = '__all__'

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'
