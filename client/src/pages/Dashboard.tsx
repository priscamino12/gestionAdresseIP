// src/pages/Dashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Globe, Laptop, Activity } from "lucide-react";
import { useAddresses } from "@/hooks/useAddresses";

export default function Dashboard() {
  const { addresses, isLoading, stats } = useAddresses("192.168.1.0/24"); // adapte si ton réseau diffère

  const totalAddresses = stats.total;
  const usedAddresses = stats.used;
  const freeAddresses = stats.free;
  const activeDevices = stats.active;

  const cards = [
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

  const recent = [...addresses]
    .filter(a => a.actif)
    .sort((a, b) => (b.derniere_detection?.localeCompare(a.derniere_detection || "") || 0))
    .slice(0, 4);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de votre réseau local
        </p>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="text-center text-muted-foreground py-12">
          Chargement des appareils réseau…
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`${stat.color} h-5 w-5`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  {"percentage" in stat && stat.percentage && (
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
              {recent.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun appareil actif détecté
                </p>
              ) : (
                <div className="space-y-4">
                  {recent.map((a) => (
                    <div
                      key={a.id ?? a.ip}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Laptop className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{a.ip}</p>
                          <p className="text-sm text-muted-foreground">
                            {a.actif ? "Actif" : "Inactif"} • {a.statut}
                          </p>
                        </div>
                      </div>
                      {a.actif ? (
                        <Badge className="bg-success text-success-foreground">Actif</Badge>
                      ) : (
                        <Badge variant="outline">Inactif</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
