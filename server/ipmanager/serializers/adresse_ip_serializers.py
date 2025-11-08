from rest_framework import serializers
from ipmanager.models import AdresseIP

class AdresseIPSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdresseIP
        fields = '__all__'
