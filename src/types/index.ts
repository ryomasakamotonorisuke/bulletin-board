export type UserRole = 'admin' | 'poster' | 'viewer' | 'store'
export type PostType = 'user' | 'store'

export interface Post {
  id: string
  user_id: string
  title: string
  content: string | null
  image_url: string | null
  image_urls?: string[] | null
  post_type: PostType
  created_at: string
  updated_at: string
  profiles?: {
    username: string | null
    full_name: string | null
    avatar_url: string | null
  }
}

export interface AppUser {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  user_id?: string | null
  email?: string | null
  role: UserRole
  is_admin: boolean
  is_employee: boolean
  is_active: boolean
  password_changed: boolean
}

export interface AdminUser extends AppUser {
  created_at: string
  last_sign_in_at?: string | null
  employee_id?: string | null
  department?: string | null
}

export interface AdminPostStats {
  id: string
  title: string
  created_at: string
  updated_at?: string
  post_type?: string
  full_name?: string | null
  username?: string | null
  is_admin?: boolean
  profiles?: {
    full_name: string | null
    username: string | null
    is_admin?: boolean
  }[]
}

export interface CreateAdminUserData {
  user_id: string
  password: string
  full_name: string
  username?: string
  role?: UserRole
  is_admin?: boolean
  is_employee?: boolean
  employee_id?: string
  department?: string
}
