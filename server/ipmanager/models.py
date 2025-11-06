from django.db import models

class AdresseIP(models.Model):
    ip = models.CharField(max_length=50, unique=True)
    statut = models.CharField(max_length=20, choices=[('disponible','Disponible'),('attribuee','Attribuée')], default='disponible')
    device = models.ForeignKey('Device', on_delete=models.SET_NULL, null=True, blank=True)
    date_ajout = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.ip

class Device(models.Model):
    nom = models.CharField(max_length=100)
    adresse_mac = models.CharField(max_length=50, unique=True)
    actif = models.BooleanField(default=True)
    date_connexion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom
