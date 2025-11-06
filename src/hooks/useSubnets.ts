import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Subnet {
  id: string;
  nom: string;
  plage_ip: string;
  passerelle: string;
  dns: string;
  total_adresses: number;
  created_at: string;
  updated_at: string;
}

export const useSubnets = () => {
  const queryClient = useQueryClient();

  const { data: subnets, isLoading } = useQuery({
    queryKey: ["subnets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sous_reseaux")
        .select("*")
        .order("nom");
      
      if (error) throw error;
      return data as Subnet[];
    },
  });

  const addSubnet = useMutation({
    mutationFn: async (subnet: Omit<Subnet, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("sous_reseaux")
        .insert(subnet)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subnets"] });
      toast.success("Sous-réseau ajouté avec succès");
    },
    onError: (error: any) => {
      toast.error("Erreur lors de l'ajout du sous-réseau");
    },
  });

  return {
    subnets,
    isLoading,
    addSubnet: addSubnet.mutate,
  };
};
