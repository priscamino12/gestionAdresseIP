from rest_framework import serializers
from ipmanager.models import SousReseau

class SousReseauSerializer(serializers.ModelSerializer):
    class Meta:
        model = SousReseau
        fields = ['id', 'nom', 'plage_ip', 'passerelle', 'dns', 'total_adresses']
