import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Laptop, Printer, Server, Camera } from "lucide-react";
import { useState } from "react";
import { useDevices } from "@/hooks/useDevices";
import { Button } from "@/components/ui/button";
import AddDeviceDialog from "@/components/dialogs/AddDeviceDialog";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const deviceIcons = {
  ordinateur: Laptop,
  imprimante: Printer,
  serveur: Server,
  camera: Camera,
  autre: Laptop,
};

export default function Devices() {
  const [search, setSearch] = useState("");
  const { devices, isLoading } = useDevices();

  const filteredDevices = devices?.filter(
    (device) =>
      device.nom.toLowerCase().includes(search.toLowerCase()) ||
      device.adresse_mac.includes(search)
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appareils</h1>
          <p className="text-muted-foreground mt-2">
            Liste des appareils détectés sur le réseau
          </p>
        </div>
        <AddDeviceDialog />
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou MAC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Devices List */}
      <Card>
        <CardHeader>
          <CardTitle>{filteredDevices.length} appareil(s) trouvé(s)</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDevices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun appareil trouvé. Ajoutez des appareils pour commencer.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredDevices.map((device) => {
                const Icon = deviceIcons[device.type];
                const lastSeen = formatDistanceToNow(new Date(device.derniere_detection), {
                  addSuffix: true,
                  locale: fr,
                });
                
                return (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{device.nom}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {device.adresse_mac}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {lastSeen}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={device.actif ? "default" : "secondary"}
                        className={
                          device.actif
                            ? "bg-success text-success-foreground"
                            : ""
                        }
                      >
                        {device.actif ? "Actif" : "Inactif"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Détails
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
