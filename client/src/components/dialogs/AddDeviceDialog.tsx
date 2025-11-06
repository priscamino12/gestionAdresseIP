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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useDevices, DeviceType } from "@/hooks/useDevices";
import { toast } from "sonner";

export default function AddDeviceDialog() {
  const { addDevice } = useDevices();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    type: "ordinateur" as DeviceType,
    adresse_mac: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.adresse_mac) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    // Validate MAC address format
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (!macRegex.test(formData.adresse_mac)) {
      toast.error("Format d'adresse MAC invalide (ex: 00:1B:44:11:3A:B7)");
      return;
    }

    addDevice(formData);
    setOpen(false);
    setFormData({
      nom: "",
      type: "ordinateur",
      adresse_mac: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un appareil
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvel appareil</DialogTitle>
          <DialogDescription>
            Enregistrez un nouvel appareil sur le réseau
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de l'appareil *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="PC-Bureau-01"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type d'appareil</Label>
            <Select
              value={formData.type}
              onValueChange={(value: DeviceType) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ordinateur">Ordinateur</SelectItem>
                <SelectItem value="imprimante">Imprimante</SelectItem>
                <SelectItem value="serveur">Serveur</SelectItem>
                <SelectItem value="camera">Caméra</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mac">Adresse MAC *</Label>
            <Input
              id="mac"
              value={formData.adresse_mac}
              onChange={(e) => setFormData({ ...formData, adresse_mac: e.target.value })}
              placeholder="00:1B:44:11:3A:B7"
              required
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
