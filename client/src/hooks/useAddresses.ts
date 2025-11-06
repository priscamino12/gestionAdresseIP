
import { useEffect, useState } from "react";

export interface AdresseIP {
  id: number;
  ip: string;
  statut: "disponible" | "attribuee";
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<AdresseIP[] | null>(null);

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await fetch("http://localhost:8000/api/adresses/");
        if (!res.ok) throw new Error("Erreur lors de la récupération des adresses");
        const data = await res.json();
        setAddresses(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchAddresses();
  }, []);

  return { addresses };
}
