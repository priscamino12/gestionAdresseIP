from django.db import models

class Device(models.Model):
    nom = models.CharField(max_length=100)
    type = models.CharField(
        max_length=20,
        choices=[
            ("ordinateur", "Ordinateur"),
            ("imprimante", "Imprimante"),
            ("serveur", "Serveur"),
            ("camera", "Caméra"),
            ("autre", "Autre"),
        ],
        default="autre"
    )
    adresse_mac = models.CharField(max_length=50, unique=True)
    actif = models.BooleanField(default=False)
    derniere_detection = models.DateTimeField(null=True, blank=True)
    date_ajout = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom} ({self.adresse_mac})"
