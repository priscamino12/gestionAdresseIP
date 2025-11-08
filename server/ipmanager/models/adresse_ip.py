from django.db import models
from .sous_reseau import SousReseau
from .device import Device

class AdresseIP(models.Model):
    ip = models.CharField(max_length=50, unique=True)
    statut = models.CharField(
        max_length=20,
        choices=[
            ('disponible', 'Disponible'),
            ('attribuee', 'Attribuée'),
            ('reservee', 'Réservée'),
        ],
        default='disponible'
    )
    sous_reseau = models.ForeignKey(SousReseau, on_delete=models.CASCADE, null=True, blank=True)
    device = models.ForeignKey(Device, on_delete=models.SET_NULL, null=True, blank=True)
    actif = models.BooleanField(default=False)
    derniere_detection = models.DateTimeField(null=True, blank=True)
    date_ajout = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ip}"
