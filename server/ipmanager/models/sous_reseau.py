from django.db import models

class SousReseau(models.Model):
    nom = models.CharField(max_length=100)
    plage_ip = models.CharField(max_length=50)
    passerelle = models.CharField(max_length=15)
    dns = models.CharField(max_length=50, default="8.8.8.8")
    total_adresses = models.IntegerField(default=254)

    def __str__(self):
        return self.nom
