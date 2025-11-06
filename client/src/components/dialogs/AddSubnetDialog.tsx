import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useSubnets } from "@/hooks/useSubnets";
import { toast } from "sonner";

export default function AddSubnetDialog() {
  const { addSubnet } = useSubnets();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    plage_ip: "",
    passerelle: "",
    dns: "8.8.8.8",
    total_adresses: 254,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.plage_ip || !formData.passerelle) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    addSubnet(formData);
    setOpen(false);
    setFormData({
      nom: "",
      plage_ip: "",
      passerelle: "",
      dns: "8.8.8.8",
      total_adresses: 254,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un sous-réseau
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau sous-réseau</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau sous-réseau à votre infrastructure
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Bureau principal"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plage_ip">Plage IP (CIDR) *</Label>
            <Input
              id="plage_ip"
              value={formData.plage_ip}
              onChange={(e) => setFormData({ ...formData, plage_ip: e.target.value })}
              placeholder="192.168.1.0/24"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passerelle">Passerelle *</Label>
            <Input
              id="passerelle"
              value={formData.passerelle}
              onChange={(e) => setFormData({ ...formData, passerelle: e.target.value })}
              placeholder="192.168.1.1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dns">DNS</Label>
            <Input
              id="dns"
              value={formData.dns}
              onChange={(e) => setFormData({ ...formData, dns: e.target.value })}
              placeholder="8.8.8.8"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total">Nombre total d'adresses</Label>
            <Input
              id="total"
              type="number"
              value={formData.total_adresses}
              onChange={(e) => setFormData({ ...formData, total_adresses: parseInt(e.target.value) })}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
