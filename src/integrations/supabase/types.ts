export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      adresses_ip: {
        Row: {
          created_at: string
          id: string
          ip: string
          sous_reseau_id: string
          statut: Database["public"]["Enums"]["ip_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip: string
          sous_reseau_id: string
          statut?: Database["public"]["Enums"]["ip_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ip?: string
          sous_reseau_id?: string
          statut?: Database["public"]["Enums"]["ip_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "adresses_ip_sous_reseau_id_fkey"
            columns: ["sous_reseau_id"]
            isOneToOne: false
            referencedRelation: "sous_reseaux"
            referencedColumns: ["id"]
          },
        ]
      }
      appareils: {
        Row: {
          actif: boolean
          adresse_mac: string
          created_at: string
          derniere_detection: string
          id: string
          nom: string
          type: Database["public"]["Enums"]["device_type"]
          updated_at: string
        }
        Insert: {
          actif?: boolean
          adresse_mac: string
          created_at?: string
          derniere_detection?: string
          id?: string
          nom: string
          type?: Database["public"]["Enums"]["device_type"]
          updated_at?: string
        }
        Update: {
          actif?: boolean
          adresse_mac?: string
          created_at?: string
          derniere_detection?: string
          id?: string
          nom?: string
          type?: Database["public"]["Enums"]["device_type"]
          updated_at?: string
        }
        Relationships: []
      }
      attributions: {
        Row: {
          adresse_ip_id: string
          appareil_id: string
          created_at: string
          date_attribution: string
          date_liberation: string | null
          id: string
          user_id: string
        }
        Insert: {
          adresse_ip_id: string
          appareil_id: string
          created_at?: string
          date_attribution?: string
          date_liberation?: string | null
          id?: string
          user_id: string
        }
        Update: {
          adresse_ip_id?: string
          appareil_id?: string
          created_at?: string
          date_attribution?: string
          date_liberation?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attributions_adresse_ip_id_fkey"
            columns: ["adresse_ip_id"]
            isOneToOne: false
            referencedRelation: "adresses_ip"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attributions_appareil_id_fkey"
            columns: ["appareil_id"]
            isOneToOne: false
            referencedRelation: "appareils"
            referencedColumns: ["id"]
          },
        ]
      }
      historique_ip: {
        Row: {
          action: string
          adresse_ip: string
          appareil_nom: string
          details: Json | null
          id: string
          timestamp: string
          user_id: string
          user_nom: string
        }
        Insert: {
          action: string
          adresse_ip: string
          appareil_nom: string
          details?: Json | null
          id?: string
          timestamp?: string
          user_id: string
          user_nom: string
        }
        Update: {
          action?: string
          adresse_ip?: string
          appareil_nom?: string
          details?: Json | null
          id?: string
          timestamp?: string
          user_id?: string
          user_nom?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          nom: string
          prenom: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          nom: string
          prenom: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nom?: string
          prenom?: string
          updated_at?: string
        }
        Relationships: []
      }
      sous_reseaux: {
        Row: {
          created_at: string
          dns: string
          id: string
          nom: string
          passerelle: string
          plage_ip: string
          total_adresses: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          dns: string
          id?: string
          nom: string
          passerelle: string
          plage_ip: string
          total_adresses: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          dns?: string
          id?: string
          nom?: string
          passerelle?: string
          plage_ip?: string
          total_adresses?: number
          updated_at?: string
        }
        Relationships: []
      }
      taches_scan: {
        Row: {
          appareils_detectes: number
          created_at: string
          date_scan: string
          id: string
          resultat: Json | null
          sous_reseau_id: string
          statut: string
        }
        Insert: {
          appareils_detectes?: number
          created_at?: string
          date_scan?: string
          id?: string
          resultat?: Json | null
          sous_reseau_id: string
          statut?: string
        }
        Update: {
          appareils_detectes?: number
          created_at?: string
          date_scan?: string
          id?: string
          resultat?: Json | null
          sous_reseau_id?: string
          statut?: string
        }
        Relationships: [
          {
            foreignKeyName: "taches_scan_sous_reseau_id_fkey"
            columns: ["sous_reseau_id"]
            isOneToOne: false
            referencedRelation: "sous_reseaux"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "technicien"
      device_type: "ordinateur" | "imprimante" | "serveur" | "camera" | "autre"
      ip_status: "disponible" | "attribuee" | "reservee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "technicien"],
      device_type: ["ordinateur", "imprimante", "serveur", "camera", "autre"],
      ip_status: ["disponible", "attribuee", "reservee"],
    },
  },
} as const
