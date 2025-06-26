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
      admin_answers: {
        Row: {
          admin_id: string
          answer: string
          created_at: string
          id: string
          is_active: boolean | null
          question_id: string
          version: number | null
        }
        Insert: {
          admin_id: string
          answer: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          question_id: string
          version?: number | null
        }
        Update: {
          admin_id?: string
          answer?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          question_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "admin_required_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_required_questions: {
        Row: {
          created_at: string
          department: string | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          question: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          question: string
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          question?: string
        }
        Relationships: []
      }
      api_call: {
        Row: {
          "API 타입": string | null
          ID: number | null
          국가중점여부: string | null
          등록기관: string | null
          목록명: string | null
          분류체계: string | null
          서비스명: string | null
          서비스유형: string | null
          에러건수: string | null
          이용허락범위: string | null
          통계일자: string | null
          표준데이터셋여부: string | null
          호출건수: number | null
        }
        Insert: {
          "API 타입"?: string | null
          ID?: number | null
          국가중점여부?: string | null
          등록기관?: string | null
          목록명?: string | null
          분류체계?: string | null
          서비스명?: string | null
          서비스유형?: string | null
          에러건수?: string | null
          이용허락범위?: string | null
          통계일자?: string | null
          표준데이터셋여부?: string | null
          호출건수?: number | null
        }
        Update: {
          "API 타입"?: string | null
          ID?: number | null
          국가중점여부?: string | null
          등록기관?: string | null
          목록명?: string | null
          분류체계?: string | null
          서비스명?: string | null
          서비스유형?: string | null
          에러건수?: string | null
          이용허락범위?: string | null
          통계일자?: string | null
          표준데이터셋여부?: string | null
          호출건수?: number | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_bot: boolean
          message_type: string | null
          related_civil_affair_id: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_bot?: boolean
          message_type?: string | null
          related_civil_affair_id?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_bot?: boolean
          message_type?: string | null
          related_civil_affair_id?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_related_civil_affair_id_fkey"
            columns: ["related_civil_affair_id"]
            isOneToOne: false
            referencedRelation: "civil_affairs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      civil_affairs: {
        Row: {
          category_id: string | null
          contact_info: string
          created_at: string
          department: string
          fees: string | null
          id: string
          notes: string | null
          processing_days: number | null
          related_laws: string[] | null
          required_documents: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          contact_info: string
          created_at?: string
          department: string
          fees?: string | null
          id?: string
          notes?: string | null
          processing_days?: number | null
          related_laws?: string[] | null
          required_documents?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          contact_info?: string
          created_at?: string
          department?: string
          fees?: string | null
          id?: string
          notes?: string | null
          processing_days?: number | null
          related_laws?: string[] | null
          required_documents?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "civil_affairs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "civil_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      civil_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "civil_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "civil_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      files_downlload: {
        Row: {
          ID: number | null
          국가중점여부: string | null
          "기관 분류": string | null
          "다운로드 수": number | null
          데이터명: string | null
          등록기관: string | null
          등록일: string | null
          목록명: string | null
          분류체계: string | null
          서비스유형: string | null
          오픈포맷: string | null
          통계일자: string | null
          "파일 유형": string | null
          표준데이터셋여부: string | null
          확장자: string | null
        }
        Insert: {
          ID?: number | null
          국가중점여부?: string | null
          "기관 분류"?: string | null
          "다운로드 수"?: number | null
          데이터명?: string | null
          등록기관?: string | null
          등록일?: string | null
          목록명?: string | null
          분류체계?: string | null
          서비스유형?: string | null
          오픈포맷?: string | null
          통계일자?: string | null
          "파일 유형"?: string | null
          표준데이터셋여부?: string | null
          확장자?: string | null
        }
        Update: {
          ID?: number | null
          국가중점여부?: string | null
          "기관 분류"?: string | null
          "다운로드 수"?: number | null
          데이터명?: string | null
          등록기관?: string | null
          등록일?: string | null
          목록명?: string | null
          분류체계?: string | null
          서비스유형?: string | null
          오픈포맷?: string | null
          통계일자?: string | null
          "파일 유형"?: string | null
          표준데이터셋여부?: string | null
          확장자?: string | null
        }
        Relationships: []
      }
      openData: {
        Row: {
          API타입: string | null
          ID: number
          국가중점여부: string | null
          "기관 분류": string | null
          기관명: string | null
          기관코드: number | null
          담당부서: string | null
          담당자명: string | null
          등록일: string | null
          마지막수정일: string | null
          "목록 폐기 여부": string | null
          "목록 폐기일": string | null
          목록명: string | null
          목록타입: string | null
          분류체계: string | null
          상위기관명: string | null
          상위기관코드: number | null
          "서비스 유형": string | null
          제공주기: string | null
          "제공주기 세부": string | null
          "제공주기준수 여부": string | null
          "차기등록 예정일": string | null
          최신데이터명: string | null
          "현재 폐기 여부": string | null
        }
        Insert: {
          API타입?: string | null
          ID: number
          국가중점여부?: string | null
          "기관 분류"?: string | null
          기관명?: string | null
          기관코드?: number | null
          담당부서?: string | null
          담당자명?: string | null
          등록일?: string | null
          마지막수정일?: string | null
          "목록 폐기 여부"?: string | null
          "목록 폐기일"?: string | null
          목록명?: string | null
          목록타입?: string | null
          분류체계?: string | null
          상위기관명?: string | null
          상위기관코드?: number | null
          "서비스 유형"?: string | null
          제공주기?: string | null
          "제공주기 세부"?: string | null
          "제공주기준수 여부"?: string | null
          "차기등록 예정일"?: string | null
          최신데이터명?: string | null
          "현재 폐기 여부"?: string | null
        }
        Update: {
          API타입?: string | null
          ID?: number
          국가중점여부?: string | null
          "기관 분류"?: string | null
          기관명?: string | null
          기관코드?: number | null
          담당부서?: string | null
          담당자명?: string | null
          등록일?: string | null
          마지막수정일?: string | null
          "목록 폐기 여부"?: string | null
          "목록 폐기일"?: string | null
          목록명?: string | null
          목록타입?: string | null
          분류체계?: string | null
          상위기관명?: string | null
          상위기관코드?: number | null
          "서비스 유형"?: string | null
          제공주기?: string | null
          "제공주기 세부"?: string | null
          "제공주기준수 여부"?: string | null
          "차기등록 예정일"?: string | null
          최신데이터명?: string | null
          "현재 폐기 여부"?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
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
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "user" | "admin"
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
    Enums: {
      user_role: ["user", "admin"],
    },
  },
} as const
