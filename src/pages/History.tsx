import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const actionColors = {
  Attribution: "bg-success text-success-foreground",
  Libération: "bg-warning text-warning-foreground",
  Modification: "default",
};

export default function History() {
  const { history, isLoading } = useHistory();

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
          <h1 className="text-3xl font-bold text-foreground">Historique</h1>
          <p className="text-muted-foreground mt-2">
            Traçabilité des attributions et modifications d'IP
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Filtrer par date
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exporter (PDF)
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Événements récents</CardTitle>
        </CardHeader>
        <CardContent>
          {!history || history.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun événement enregistré pour le moment.
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => {
                const formattedDate = format(new Date(entry.timestamp), "dd/MM/yyyy HH:mm", {
                  locale: fr,
                });
                
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <Badge
                        variant={
                          entry.action === "Attribution"
                            ? "default"
                            : entry.action === "Modification"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          actionColors[entry.action as keyof typeof actionColors]
                        }
                      >
                        {entry.action}
                      </Badge>
                      <div>
                        <p className="font-semibold text-foreground">
                          {entry.appareil_nom}
                        </p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {entry.adresse_ip}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {entry.user_nom}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formattedDate}
                      </p>
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
