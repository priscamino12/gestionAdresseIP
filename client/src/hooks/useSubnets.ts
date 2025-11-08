import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Subnet {
  id: number;
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

  const { data: subnets, isLoading } = useQuery<Subnet[]>({
    queryKey: ["subnets"],
    queryFn: async () => {
      const res = await fetch("/api/sous-reseaux/");
      if (!res.ok) throw new Error("Erreur lors de la récupération des sous-réseaux");
      return res.json();
    },
  });

  const addSubnet = useMutation({
    mutationFn: async (subnet: Omit<Subnet, "id" | "created_at" | "updated_at">) => {
      const res = await fetch("/api/sous-reseaux/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subnet),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout du sous-réseau");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subnets"] });
      alert("Sous-réseau ajouté avec succès !");
    },
    onError: (error: any) => {
      alert("Erreur lors de l'ajout du sous-réseau");
    },
  });

  return {
    subnets,
    isLoading,
    addSubnet: addSubnet.mutate,
  };
};
