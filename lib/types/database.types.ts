export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          activity_metrics: string | null
          board_id: string
          created_at: string | null
          id: string
          performance_data: string | null
          updated_at: string | null
          user_engagement: string | null
        }
        Insert: {
          activity_metrics?: string | null
          board_id: string
          created_at?: string | null
          id?: string
          performance_data?: string | null
          updated_at?: string | null
          user_engagement?: string | null
        }
        Update: {
          activity_metrics?: string | null
          board_id?: string
          created_at?: string | null
          id?: string
          performance_data?: string | null
          updated_at?: string | null
          user_engagement?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "game_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      game_boards: {
        Row: {
          created_at: string | null
          current_state: string
          dimensions: string
          id: string
          name: string
          rules: string
          updated_at: string | null
          version: number
        }
        Insert: {
          created_at?: string | null
          current_state: string
          dimensions: string
          id?: string
          name: string
          rules: string
          updated_at?: string | null
          version?: number
        }
        Update: {
          created_at?: string | null
          current_state?: string
          dimensions?: string
          id?: string
          name?: string
          rules?: string
          updated_at?: string | null
          version?: number
        }
        Relationships: []
      }
      pattern_evolution: {
        Row: {
          ai_suggestions: string | null
          board_id: string
          created_at: string | null
          evolution_history: string | null
          frequency: number
          id: string
          pattern: string
          performance_metrics: string | null
          updated_at: string | null
        }
        Insert: {
          ai_suggestions?: string | null
          board_id: string
          created_at?: string | null
          evolution_history?: string | null
          frequency?: number
          id?: string
          pattern: string
          performance_metrics?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_suggestions?: string | null
          board_id?: string
          created_at?: string | null
          evolution_history?: string | null
          frequency?: number
          id?: string
          pattern?: string
          performance_metrics?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pattern_evolution_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "game_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_events: {
        Row: {
          board_id: string
          created_at: string | null
          effects: string | null
          event_history: string | null
          event_type: string
          id: string
          outcomes: string | null
          updated_at: string | null
        }
        Insert: {
          board_id: string
          created_at?: string | null
          effects?: string | null
          event_history?: string | null
          event_type: string
          id?: string
          outcomes?: string | null
          updated_at?: string | null
        }
        Update: {
          board_id?: string
          created_at?: string | null
          effects?: string | null
          event_history?: string | null
          event_type?: string
          id?: string
          outcomes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_events_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "game_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_participation: {
        Row: {
          board_id: string
          contributions: string | null
          created_at: string | null
          cursor_position: string | null
          id: string
          session_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          board_id: string
          contributions?: string | null
          created_at?: string | null
          cursor_position?: string | null
          id?: string
          session_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          board_id?: string
          contributions?: string | null
          created_at?: string | null
          cursor_position?: string | null
          id?: string
          session_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_participation_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "game_boards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

