import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Subnet {
  id: number;
  nom: string;
  plage_ip: string;
  passerelle: string;
  dns: string;
  total_adresses: number;
  created_at?: string;   // Django les fournit si ajoutés dans le serializer
  updated_at?: string;
}

export const useSubnets = () => {
  const queryClient = useQueryClient();

  // ✅ Récupération des sous-réseaux via Django
  const { data: subnets, isLoading } = useQuery<Subnet[]>({
    queryKey: ["subnets"],
    queryFn: async () => {
      const res = await fetch("http://127.0.0.1:8000/api/sous-reseaux/");
      if (!res.ok) throw new Error("Erreur lors de la récupération des sous-réseaux");
      return res.json();
    },
  });

  // ✅ Ajout de sous-réseau via Django
  const addSubnet = useMutation({
    mutationFn: async (subnet: Omit<Subnet, "id" | "created_at" | "updated_at">) => {
      const res = await fetch("http://127.0.0.1:8000/api/sous-reseaux/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subnet),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error("Erreur API:", errorData);
        throw new Error("Erreur lors de l'ajout du sous-réseau");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subnets"] });
      alert("Sous-réseau ajouté avec succès !");
    },

    onError: () => {
      alert("Erreur lors de l'ajout du sous-réseau");
    },
  });

  return {
    subnets: subnets || [],
    isLoading,
    addSubnet: addSubnet.mutate,
  };
};
