import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground mt-2">
          Configuration de l'application et du réseau
        </p>
      </div>

      <div className="space-y-6">
        {/* Network Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration réseau</CardTitle>
            <CardDescription>
              Paramètres de base pour la gestion du réseau
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scan-interval">Intervalle de scan (minutes)</Label>
                <Input id="scan-interval" type="number" defaultValue="5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout de ping (ms)</Label>
                <Input id="timeout" type="number" defaultValue="1000" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="space-y-0.5">
                <Label>Scan automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Activer la découverte automatique des appareils
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Gérer les alertes et notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Nouveau périphérique détecté</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir une alerte lors de la détection d'un nouvel appareil
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Seuil d'utilisation réseau</Label>
                <p className="text-sm text-muted-foreground">
                  Alerter quand l'utilisation dépasse 80%
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Conflits d'adresses IP</Label>
                <p className="text-sm text-muted-foreground">
                  Alerter en cas de détection de conflit IP
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Database */}
        <Card>
          <CardHeader>
            <CardTitle>Base de données</CardTitle>
            <CardDescription>
              Gestion des données et historiques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="history-days">Durée de conservation de l'historique (jours)</Label>
              <Input id="history-days" type="number" defaultValue="90" />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline">Sauvegarder la base</Button>
              <Button variant="outline">Nettoyer l'historique ancien</Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Annuler</Button>
          <Button>Enregistrer les modifications</Button>
        </div>
      </div>
    </div>
  );
}
