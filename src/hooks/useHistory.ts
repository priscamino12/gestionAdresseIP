import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HistoryEntry {
  id: string;
  adresse_ip: string;
  appareil_nom: string;
  action: string;
  user_id: string;
  user_nom: string;
  timestamp: string;
  details: any;
}

export const useHistory = () => {
  const { data: history, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("historique_ip")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as HistoryEntry[];
    },
  });

  return {
    history,
    isLoading,
  };
};
