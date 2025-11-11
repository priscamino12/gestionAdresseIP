// src/hooks/useAddresses.ts
import { useEffect, useMemo, useState } from "react";

export type IPStatus = "disponible" | "attribuee" | string;

export interface AdresseIP {
  id: number | null;
  ip: string;
  statut: IPStatus;
  actif?: boolean;                 // ✅ nouveau
  derniere_detection?: string | null;
  /* sous_reseau_id: string | number; */
  sous_reseau_id?: number | null;  // <-- ajoute cette ligne
  created_at: string;
  updated_at: string;
}

export function useAddresses(networkCidr = "192.168.1.0/24") {
  const [addresses, setAddresses] = useState<AdresseIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchAddresses() {
    try {
      const url = `http://127.0.0.1:8000/api/scan/?network=${encodeURIComponent(networkCidr)}`;
      const res = await fetch(url);
      const data = await res.json();

      // normaliser & typer
      const normalized: AdresseIP[] = (data || []).map((a: any) => ({
        id: a.id ?? null,
        ip: a.ip,
        statut: (a.statut || "disponible").toLowerCase(),
        actif: Boolean(a.actif),
        derniere_detection: a.derniere_detection ?? null,
        sous_reseau_id: a.sous_reseau ?? null, 
      }));

      setAddresses(normalized);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAddresses();
    const id = setInterval(fetchAddresses, 10_000); // 🔁 refresh toutes les 10s
    return () => clearInterval(id);
  }, [networkCidr]);

  // Quelques dérivés utiles si tu veux les exposer directement
  const stats = useMemo(() => {
    const total = addresses.length;
    const used = addresses.filter(a => a.statut === "attribuee").length;
    const free = addresses.filter(a => a.statut === "disponible").length;
    const active = addresses.filter(a => a.actif).length;

    return { total, used, free, active };
  }, [addresses]);

  return { addresses, isLoading, stats, refetch: fetchAddresses };
}
