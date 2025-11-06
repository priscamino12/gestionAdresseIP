import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Globe, Laptop, Activity } from "lucide-react";
import { useAddresses } from "@/hooks/useAddresses";
import { useDevices } from "@/hooks/useDevices";

export default function Dashboard() {
  const { addresses } = useAddresses();
  const { devices } = useDevices();

  const totalAddresses = addresses?.length || 0;
  const usedAddresses = addresses?.filter(a => a.statut === "attribuee").length || 0;
  const freeAddresses = addresses?.filter(a => a.statut === "disponible").length || 0;
  const activeDevices = devices?.filter(d => d.actif).length || 0;

  const stats = [
    {
      title: "Adresses totales",
      value: totalAddresses.toString(),
      icon: Globe,
      color: "text-primary",
    },
    {
      title: "Adresses utilisées",
      value: usedAddresses.toString(),
      percentage: totalAddresses > 0 ? `${Math.round((usedAddresses / totalAddresses) * 100)}%` : "0%",
      icon: Network,
      color: "text-destructive",
    },
    {
      title: "Adresses libres",
      value: freeAddresses.toString(),
      percentage: totalAddresses > 0 ? `${Math.round((freeAddresses / totalAddresses) * 100)}%` : "0%",
      icon: Activity,
      color: "text-success",
    },
    {
      title: "Appareils actifs",
      value: activeDevices.toString(),
      icon: Laptop,
      color: "text-warning",
    },
  ];

  const recentDevices = devices?.filter(d => d.actif).slice(0, 4) || [];
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de votre réseau local
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              {stat.percentage && (
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.percentage} du réseau
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Devices */}
      <Card>
        <CardHeader>
          <CardTitle>Appareils récemment détectés</CardTitle>
        </CardHeader>
        <CardContent>
          {recentDevices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun appareil actif détecté
            </p>
          ) : (
            <div className="space-y-4">
              {recentDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Laptop className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{device.nom}</p>
                      <p className="text-sm text-muted-foreground">
                        {device.adresse_mac}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-success text-success-foreground">
                    Actif
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
