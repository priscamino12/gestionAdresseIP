import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type IPStatus = "disponible" | "attribuee" | "reservee";

export interface IPAddress {
  id: string;
  ip: string;
  statut: IPStatus;
  sous_reseau_id: string;
  created_at: string;
  updated_at: string;
}

export const useAddresses = (subnetId?: string) => {
  const queryClient = useQueryClient();

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses", subnetId],
    queryFn: async () => {
      let query = supabase
        .from("adresses_ip")
        .select("*")
        .order("ip");
      
      if (subnetId) {
        query = query.eq("sous_reseau_id", subnetId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as IPAddress[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: IPStatus }) => {
      const { error } = await supabase
        .from("adresses_ip")
        .update({ statut })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Statut mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  return {
    addresses,
    isLoading,
    updateStatus: updateStatus.mutate,
  };
};
