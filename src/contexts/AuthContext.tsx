'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AppUser } from '@/types'

interface AuthContextType {
  user: AppUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1秒で強制的にローディング終了（軽量化）
    const timeoutId = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    // 認証状態を簡易確認
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setSession(session)
          console.log('Session found:', session.user.id)
          
          // プロフィール情報を取得（エラーハンドリング）
          let profile = null
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('username, full_name, avatar_url, user_id, role, is_admin, is_employee, is_active, password_changed')
              .eq('id', session.user.id)
              .single()
            profile = data
            console.log('Profile fetched:', profile)
          } catch (err) {
            console.log('Profile fetch error, using defaults:', err)
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email,
            username: profile?.username || null,
            full_name: profile?.full_name || session.user.user_metadata?.full_name || null,
            avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url || null,
            user_id: profile?.user_id || null,
            role: (profile?.role as any) || 'viewer',
            is_admin: profile?.is_admin || false,
            is_employee: profile?.is_employee || false,
            is_active: profile?.is_active !== undefined ? profile.is_active : true,
            password_changed: profile?.password_changed !== undefined ? profile.password_changed : true,
          })
          
          console.log('User set successfully')
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
      } finally {
        clearTimeout(timeoutId)
        setLoading(false)
      }
    }

    checkAuth()

    // 認証状態の変更を監視（軽量化）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        
        if (session?.user) {
          // プロフィール情報を取得（エラーハンドリング）
          let profile = null
          try {
            const { data } = await supabase
              .from('profiles')
              .select('username, full_name, avatar_url, user_id, role, is_admin, is_employee, is_active, password_changed')
              .eq('id', session.user.id)
              .single()
            profile = data
          } catch (err) {
            console.log('Profile fetch error, using defaults:', err)
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email,
            username: profile?.username || null,
            full_name: profile?.full_name || session.user.user_metadata?.full_name || null,
            avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url || null,
            user_id: profile?.user_id || null,
            role: (profile?.role as any) || 'viewer',
            is_admin: profile?.is_admin || false,
            is_employee: profile?.is_employee || false,
            is_active: profile?.is_active !== undefined ? profile.is_active : true,
            password_changed: profile?.password_changed !== undefined ? profile.password_changed : true,
          })
          
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('=== Login Start ===')
    console.log('Email:', email)
    
    // 環境変数の確認
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定')
    
    try {
      console.log('📤 Sending login request...')
      
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log('📥 Response received')
      console.log('response.error:', response.error)
      console.log('response.data:', response.data)
      
      if (response.error) {
        console.error('❌ Login failed:', response.error.message)
        return { error: response.error }
      }

      console.log('✅ Login successful')
      console.log('User:', response.data?.user?.email)
      
      return { error: null }
    } catch (err) {
      console.error('💥 Exception:', err)
      return { error: { message: String(err) } }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { error }
  }

  const signOut = async () => {
    console.log('🔒 Signing out...')
    try {
      // セッションをクリア
      await supabase.auth.signOut()
      
      // ローカル状態をリセット
      setUser(null)
      setSession(null)
      
      console.log('✅ Signed out successfully')
    } catch (err) {
      console.error('❌ Sign out error:', err)
    }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // 現在のパスワードを確認
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return { error: { message: 'セッションが無効です。再度ログインしてください。' } }
      }

      // Supabaseの認証情報を更新
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) {
        return { error }
      }

      // パスワード変更フラグを更新
      if (user) {
        try {
          await supabase
            .from('profiles')
            .update({ password_changed: true })
            .eq('id', user.id)
          
          if (user) {
            setUser({ ...user, password_changed: true })
          }
        } catch (err) {
          console.log('Profile update error:', err)
        }
      }
      
      return { error: null }
    } catch (err: any) {
      return { error: { message: err.message || 'パスワードの変更に失敗しました' } }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}