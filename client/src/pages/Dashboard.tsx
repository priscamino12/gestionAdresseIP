import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Globe, Laptop, Activity } from "lucide-react";
import { useAddresses } from "@/hooks/useAddresses";

export default function Dashboard() {
  const { addresses, loading } = useAddresses();

  if (loading || !addresses) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Chargement des appareils du réseau…
      </div>
    );
  }

  const normalized = addresses.map(a => ({
    ...a,
    statut: a.statut?.toLowerCase()
  }));

  const totalAddresses = normalized.length;
  const usedAddresses = normalized.filter(a => a.statut === "attribuee").length;
  const freeAddresses = normalized.filter(a => a.statut === "disponible").length;
  const activeDevices = usedAddresses;

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

  // ✅ On prend les 4 dernières IP scannées
  const recentDevices = normalized.slice(-4).reverse();

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
              <stat.icon className={`${stat.color} h-5 w-5`} />
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
                      <p className="font-medium text-foreground">{device.ip}</p>
                      <p className="text-sm text-muted-foreground">
                        {device.statut}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-success text-success-foreground">
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
