'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AppUser } from '@/types'

interface AuthContextType {
  user: AppUser | null
  session: Session | null
  loading: boolean
  requiresPasswordChange: boolean
  signIn: (user_id: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updatePassword: (password: string) => Promise<{ error: any }>
  markPasswordChanged: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false)

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
          
          // 初回ログイン時チェック
          setRequiresPasswordChange(profile?.password_changed === false)
        } else {
          setUser(null)
        }
      } catch (error) {
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
          
          // 初回ログイン時チェック
          setRequiresPasswordChange(profile?.password_changed === false)
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

  const signIn = async (user_id: string, password: string) => {
    // user_idをメールアドレスとして扱う（Supabase Auth互換）
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user_id,
      password,
    })
    
    if (authError) {
      return { error: authError }
    }

    // ログイン成功後、プロフィールチェック
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      let profile = null
      try {
        const { data } = await supabase
          .from('profiles')
          .select('is_employee, is_admin, is_active, password_changed')
          .eq('id', session.user.id)
          .single()
        profile = data
      } catch (err) {
        console.log('Profile check error:', err)
      }

      // アクティブでない場合
      if (profile && !profile.is_active) {
        await supabase.auth.signOut()
        return { 
          error: { 
            message: 'このアカウントは無効化されています。管理者にお問い合わせください。' 
          } 
        }
      }

      // 初回ログイン時パスワード変更が必要
      if (profile && !profile.password_changed) {
        setRequiresPasswordChange(true)
      }
    }

    return { error: null }
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
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: password
    })
    
    if (!error && user) {
      // パスワード変更フラグを更新
      await supabase
        .from('profiles')
        .update({ password_changed: true })
        .eq('id', user.id)
      
      setRequiresPasswordChange(false)
      setUser({ ...user, password_changed: true })
    }
    
    return { error }
  }

  const markPasswordChanged = async () => {
    if (user) {
      await supabase
        .from('profiles')
        .update({ password_changed: true })
        .eq('id', user.id)
      
      setRequiresPasswordChange(false)
      setUser({ ...user, password_changed: true })
    }
  }

  const value = {
    user,
    session,
    loading,
    requiresPasswordChange,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    markPasswordChanged,
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