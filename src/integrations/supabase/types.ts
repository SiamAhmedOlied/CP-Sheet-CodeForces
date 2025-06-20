export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      problem_progress: {
        Row: {
          attempts: number | null
          contest_id: number
          created_at: string
          first_attempt_at: string | null
          id: string
          last_attempt_at: string | null
          notes: string | null
          problem_index: string
          problem_name: string
          problem_rating: number | null
          problem_tags: string[] | null
          solved_at: string | null
          status: string
          updated_at: string
          user_handle: string
        }
        Insert: {
          attempts?: number | null
          contest_id: number
          created_at?: string
          first_attempt_at?: string | null
          id?: string
          last_attempt_at?: string | null
          notes?: string | null
          problem_index: string
          problem_name: string
          problem_rating?: number | null
          problem_tags?: string[] | null
          solved_at?: string | null
          status?: string
          updated_at?: string
          user_handle: string
        }
        Update: {
          attempts?: number | null
          contest_id?: number
          created_at?: string
          first_attempt_at?: string | null
          id?: string
          last_attempt_at?: string | null
          notes?: string | null
          problem_index?: string
          problem_name?: string
          problem_rating?: number | null
          problem_tags?: string[] | null
          solved_at?: string | null
          status?: string
          updated_at?: string
          user_handle?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_progress_user_handle_fkey"
            columns: ["user_handle"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["codeforces_handle"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          codeforces_handle: string
          contribution: number | null
          created_at: string
          current_rating: number | null
          email: string | null
          friend_count: number | null
          full_name: string | null
          id: string
          last_sync: string | null
          max_rank: string | null
          max_rating: number | null
          rank: string | null
          registration_date: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          codeforces_handle: string
          contribution?: number | null
          created_at?: string
          current_rating?: number | null
          email?: string | null
          friend_count?: number | null
          full_name?: string | null
          id?: string
          last_sync?: string | null
          max_rank?: string | null
          max_rating?: number | null
          rank?: string | null
          registration_date?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          codeforces_handle?: string
          contribution?: number | null
          created_at?: string
          current_rating?: number | null
          email?: string | null
          friend_count?: number | null
          full_name?: string | null
          id?: string
          last_sync?: string | null
          max_rank?: string | null
          max_rating?: number | null
          rank?: string | null
          registration_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_rating_history: {
        Row: {
          contest_id: number
          contest_name: string
          created_at: string
          id: string
          new_rating: number
          old_rating: number
          participation_time: string
          rank: number
          rating_change: number
          user_handle: string
        }
        Insert: {
          contest_id: number
          contest_name: string
          created_at?: string
          id?: string
          new_rating: number
          old_rating: number
          participation_time: string
          rank: number
          rating_change: number
          user_handle: string
        }
        Update: {
          contest_id?: number
          contest_name?: string
          created_at?: string
          id?: string
          new_rating?: number
          old_rating?: number
          participation_time?: string
          rank?: number
          rating_change?: number
          user_handle?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rating_history_user_handle_fkey"
            columns: ["user_handle"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["codeforces_handle"]
          },
        ]
      }
      user_submissions: {
        Row: {
          author: string
          contest_id: number | null
          created_at: string
          creation_time: string
          id: string
          memory_consumed_bytes: number | null
          passed_test_count: number | null
          points: number | null
          problem_index: string | null
          programming_language: string
          submission_id: number
          test_set: string | null
          time_consumed_millis: number | null
          user_handle: string
          verdict: string
        }
        Insert: {
          author: string
          contest_id?: number | null
          created_at?: string
          creation_time: string
          id?: string
          memory_consumed_bytes?: number | null
          passed_test_count?: number | null
          points?: number | null
          problem_index?: string | null
          programming_language: string
          submission_id: number
          test_set?: string | null
          time_consumed_millis?: number | null
          user_handle: string
          verdict: string
        }
        Update: {
          author?: string
          contest_id?: number | null
          created_at?: string
          creation_time?: string
          id?: string
          memory_consumed_bytes?: number | null
          passed_test_count?: number | null
          points?: number | null
          problem_index?: string | null
          programming_language?: string
          submission_id?: number
          test_set?: string | null
          time_consumed_millis?: number | null
          user_handle?: string
          verdict?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_submissions_user_handle_fkey"
            columns: ["user_handle"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["codeforces_handle"]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
