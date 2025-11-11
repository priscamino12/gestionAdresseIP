import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddSubnetDialog from "@/components/dialogs/AddSubnetDialog";
import { useSubnets } from "@/hooks/useSubnets";
import { useAddresses } from "@/hooks/useAddresses";
import { Button } from "@/components/ui/button";

export default function Subnets() {
  const { subnets, isLoading } = useSubnets();
  const { addresses } = useAddresses();

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
          <h1 className="text-3xl font-bold text-foreground">Sous-réseaux</h1>
          <p className="text-muted-foreground mt-2">
            Gérer les plages d'adresses IP de votre réseau
          </p>
        </div>
        <AddSubnetDialog />
      </div>

      {!subnets || subnets.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              Aucun sous-réseau configuré. Cliquez sur "Ajouter un sous-réseau" pour commencer.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {subnets.map((subnet) => {
            // Filtrer les adresses appartenant à ce sous-réseau
            const subnetAddresses =
              addresses?.filter(
                a =>
                  a.sous_reseau_id === subnet.id &&    // appartient au sous-reseau
                  a.actif === true                     // uniquement actives
              ) || [];

            const used = subnetAddresses.length;
            const total = subnet.total_adresses;
            const usagePercent = total > 0 ? Math.round((used / total) * 100) : 0;


            return (
              <Card key={subnet.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{subnet.nom}</CardTitle>
                    <Badge variant="outline">{subnet.plage_ip}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Utilisation</span>
                      <span className="font-medium">
                        {used} / {total} ({usagePercent}%)
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Passerelle</p>
                      <p className="font-medium">{subnet.passerelle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">DNS</p>
                      <p className="font-medium">{subnet.dns}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Voir les IP
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
