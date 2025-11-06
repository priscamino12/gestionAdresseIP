import { useEffect, useState } from "react";

export type IPStatus = "disponible" | "attribuee" | "Attribuée" | string;

export interface AdresseIP {
  id: number | null;
  ip: string;
  statut: IPStatus;
}


export function useAddresses() {
  const [addresses, setAddresses] = useState<AdresseIP[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/scan/");
        const data = await res.json();

        // ✅ normalisation
        const normalized = data.map((addr: any) => ({
          id: addr.id ?? null,
          ip: addr.ip,
          statut: (addr.statut || "").toLowerCase(),
        }));

        setAddresses(normalized);
        console.log("Données reçues du backend :", normalized);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAddresses();
  }, []);

  return { addresses, loading };
}
