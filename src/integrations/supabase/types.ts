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
      assessments: {
        Row: {
          created_at: string | null
          description: string
          id: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string | null
          credential_id: string
          date: string
          description: string | null
          expiry_date: string | null
          id: string
          image: string | null
          issue_date: string | null
          issuer: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credential_id: string
          date: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          image?: string | null
          issue_date?: string | null
          issuer: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credential_id?: string
          date?: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          image?: string | null
          issue_date?: string | null
          issuer?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          instructor_id: string | null
          price: number | null
          rating: number | null
          status: string | null
          students: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          price?: number | null
          rating?: number | null
          status?: string | null
          students?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          price?: number | null
          rating?: number | null
          status?: string | null
          students?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      growth_opportunities: {
        Row: {
          courses: number | null
          created_at: string | null
          description: string
          id: string
          match: number
          skill: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          courses?: number | null
          created_at?: string | null
          description: string
          id?: string
          match?: number
          skill: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          courses?: number | null
          created_at?: string | null
          description?: string
          id?: string
          match?: number
          skill?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      learning_progress: {
        Row: {
          created_at: string | null
          id: string
          month: string
          progress: number
          updated_at: string | null
          user_skills_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          month: string
          progress?: number
          updated_at?: string | null
          user_skills_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          month?: string
          progress?: number
          updated_at?: string | null
          user_skills_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_progress_user_skills_id_fkey"
            columns: ["user_skills_id"]
            isOneToOne: false
            referencedRelation: "user_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          module_id: string | null
          position: number | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          position?: number | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          position?: number | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          position: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          position?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          position?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_shares: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          method: string
          recipient_email: string | null
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          method: string
          recipient_email?: string | null
          token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          method?: string
          recipient_email?: string | null
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          created_at: string | null
          description: string
          id: string
          match: number
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          match?: number
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          match?: number
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      review_replies: {
        Row: {
          created_at: string | null
          id: string
          instructor_id: string | null
          reply: string
          review_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          instructor_id?: string | null
          reply: string
          review_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          instructor_id?: string | null
          reply?: string
          review_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_replies_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          course_id: string | null
          created_at: string | null
          id: string
          rating: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_distribution: {
        Row: {
          category: string
          created_at: string | null
          id: string
          percentage: number
          updated_at: string | null
          user_skills_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          percentage: number
          updated_at?: string | null
          user_skills_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          percentage?: number
          updated_at?: string | null
          user_skills_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_distribution_user_skills_id_fkey"
            columns: ["user_skills_id"]
            isOneToOne: false
            referencedRelation: "user_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_groups: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_skills_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_skills_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_skills_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_groups_user_skills_id_fkey"
            columns: ["user_skills_id"]
            isOneToOne: false
            referencedRelation: "user_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          level: number
          name: string
          skill_group_id: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          level?: number
          name: string
          skill_group_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          level?: number
          name?: string
          skill_group_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_skill_group_id_fkey"
            columns: ["skill_group_id"]
            isOneToOne: false
            referencedRelation: "skill_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          course_id: string
          id: string
          last_accessed: string
          last_material_id: string | null
          last_module_id: string | null
          progress_percentage: number
          user_id: string
        }
        Insert: {
          course_id: string
          id?: string
          last_accessed?: string
          last_material_id?: string | null
          last_module_id?: string | null
          progress_percentage?: number
          user_id: string
        }
        Update: {
          course_id?: string
          id?: string
          last_accessed?: string
          last_material_id?: string | null
          last_module_id?: string | null
          progress_percentage?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_course"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_material"
            columns: ["last_material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_module"
            columns: ["last_module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roadmap: {
        Row: {
          created_at: string | null
          description: string
          id: string
          progress: number | null
          steps: Json
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          progress?: number | null
          steps?: Json
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          progress?: number | null
          steps?: Json
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analyze_performance: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
      get_average_rating: {
        Args: {
          course_id: string
        }
        Returns: number
      }
      get_course_recommendations: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
      get_learning_path: {
        Args: {
          user_id: string
          course_id: string
        }
        Returns: Json
      }
      predict_completion_time: {
        Args: {
          user_id: string
          course_id: string
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
