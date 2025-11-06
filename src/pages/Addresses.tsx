import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useAddresses, IPStatus } from "@/hooks/useAddresses";
import { Button } from "@/components/ui/button";

const statusConfig = {
  disponible: { label: "Disponible", variant: "default" as const, className: "bg-success text-success-foreground" },
  attribuee: { label: "Attribuée", variant: "destructive" as const, className: "" },
  reservee: { label: "Réservée", variant: "secondary" as const, className: "bg-warning text-warning-foreground" },
};

export default function Addresses() {
  const [filter, setFilter] = useState<IPStatus | "all">("all");
  const [search, setSearch] = useState("");
  const { addresses, isLoading, updateStatus } = useAddresses();

  const filteredAddresses = addresses?.filter((addr) => {
    const matchesFilter = filter === "all" || addr.statut === filter;
    const matchesSearch = addr.ip.includes(search);
    return matchesFilter && matchesSearch;
  }) || [];

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
          <h1 className="text-3xl font-bold text-foreground">Adresses IP</h1>
          <p className="text-muted-foreground mt-2">
            Gérer toutes les adresses IP du réseau
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par IP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={(value) => setFilter(value as IPStatus | "all")}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="attribuee">Attribuée</SelectItem>
                <SelectItem value="reservee">Réservée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* IP List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredAddresses.length} adresse(s) trouvée(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAddresses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune adresse IP trouvée. Ajoutez des sous-réseaux pour commencer.
            </p>
          ) : (
            <div className="space-y-2">
              {filteredAddresses.map((addr) => {
                const config = statusConfig[addr.statut];
                return (
                  <div
                    key={addr.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <div className="font-mono font-semibold text-lg min-w-[140px]">
                        {addr.ip}
                      </div>
                      <Badge variant={config.variant} className={config.className}>
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {addr.statut === "disponible" ? (
                        <Button 
                          size="sm"
                          onClick={() => updateStatus({ id: addr.id, statut: "attribuee" })}
                        >
                          Attribuer
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                          {addr.statut === "attribuee" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateStatus({ id: addr.id, statut: "disponible" })}
                            >
                              Libérer
                            </Button>
                          )}
                        </>
                      )}
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
