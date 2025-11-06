import { useEffect, useState } from "react";

export interface Device {
  id: number;
  nom: string;
  adresse_mac: string;
  actif: boolean;
}

export function useDevices() {
  const [devices, setDevices] = useState<Device[] | null>(null);

  useEffect(() => {
    async function fetchDevices() {
      try {
        const res = await fetch("http://localhost:8000/api/devices/");
        if (!res.ok) throw new Error("Erreur lors de la récupération des appareils");
        const data = await res.json();
        setDevices(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchDevices();
  }, []);

  return { devices };
}
