import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 環境変数の確認
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase環境変数が設定されていません！')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '設定済み' : '未設定')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// データベースの型定義
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          is_admin: boolean
          is_employee: boolean
          employee_id: string | null
          department: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          is_employee?: boolean
          employee_id?: string | null
          department?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          is_employee?: boolean
          employee_id?: string | null
          department?: string | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string | null
          image_url: string | null
          image_urls: string[] | null
          post_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string | null
          image_url?: string | null
          image_urls?: string[] | null
          post_type?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string | null
          image_url?: string | null
          image_urls?: string[] | null
          post_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      invitations: {
        Row: {
          id: string
          email: string
          full_name: string | null
          employee_id: string | null
          department: string | null
          invited_by: string | null
          status: string
          token: string
          expires_at: string
          created_at: string
          accepted_at: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          employee_id?: string | null
          department?: string | null
          invited_by?: string | null
          status?: string
          token: string
          expires_at: string
          created_at?: string
          accepted_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          employee_id?: string | null
          department?: string | null
          invited_by?: string | null
          status?: string
          token?: string
          expires_at?: string
          created_at?: string
          accepted_at?: string | null
        }
      }
    }
    Views: {
      post_stats: {
        Row: {
          post_id: string
          like_count: number
          comment_count: number
          last_comment_at: string | null
        }
      }
    }
  }
}
