/* ============================================================
   Auto-generated Supabase Database Types
   
   These types match the tables defined in supabase/migrations/001_schema.sql.
   If you change the schema, update these types to match.
   ============================================================ */

export type UserRole = 'user' | 'admin';
export type OrderStatus = 'pending' | 'approved' | 'rejected';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: UserRole;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string;
          role?: UserRole;
          avatar_url?: string | null;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          subtitle: string;
          description: string;
          price: number;
          anchor_price: number;
          currency: string;
          lesson_count: number;
          duration: string;
          pass_rate: number;
          badge: string | null;
          features: string[];
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          subtitle: string;
          description: string;
          price: number;
          anchor_price: number;
          currency?: string;
          lesson_count: number;
          duration: string;
          pass_rate: number;
          badge?: string | null;
          features: string[];
          is_active?: boolean;
        };
        Update: {
          title?: string;
          subtitle?: string;
          description?: string;
          price?: number;
          anchor_price?: number;
          currency?: string;
          lesson_count?: number;
          duration?: string;
          pass_rate?: number;
          badge?: string | null;
          features?: string[];
          is_active?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          status: OrderStatus;
          proof_image_path: string | null;
          payer_name: string;
          payer_email: string;
          payer_phone: string | null;
          amount: number;
          admin_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          status?: OrderStatus;
          proof_image_path?: string | null;
          payer_name: string;
          payer_email: string;
          payer_phone?: string | null;
          amount: number;
          admin_note?: string | null;
        };
        Update: {
          status?: OrderStatus;
          proof_image_path?: string | null;
          admin_note?: string | null;
          updated_at?: string;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
}
