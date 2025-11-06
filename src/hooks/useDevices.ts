import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type DeviceType = "ordinateur" | "imprimante" | "serveur" | "camera" | "autre";

export interface Device {
  id: string;
  nom: string;
  type: DeviceType;
  adresse_mac: string;
  actif: boolean;
  derniere_detection: string;
  created_at: string;
  updated_at: string;
}

export const useDevices = () => {
  const queryClient = useQueryClient();

  const { data: devices, isLoading } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appareils")
        .select("*")
        .order("derniere_detection", { ascending: false });
      
      if (error) throw error;
      return data as Device[];
    },
  });

  const addDevice = useMutation({
    mutationFn: async (device: Omit<Device, "id" | "created_at" | "updated_at" | "derniere_detection" | "actif">) => {
      const { data, error } = await supabase
        .from("appareils")
        .insert(device)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      toast.success("Appareil ajouté avec succès");
    },
    onError: (error: any) => {
      toast.error("Erreur lors de l'ajout de l'appareil");
    },
  });

  return {
    devices,
    isLoading,
    addDevice: addDevice.mutate,
  };
};
