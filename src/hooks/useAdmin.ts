'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminUser, AdminPostStats, CreateAdminUserData } from '@/types'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 管理者権限をチェック
  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsAdmin(false)
        return
      }

      // プロフィールから管理者フラグを取得
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      setIsAdmin(profile?.is_admin || false)
    } catch (err) {
      setError('管理者権限の確認に失敗しました')
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    checkAdminStatus()
  }, [])

  // 管理者ユーザー一覧を取得（軽量化）
  const getAdminUsers = async (): Promise<AdminUser[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_admin', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching admin users:', err)
      return []
    }
  }

  // 全ユーザー一覧を取得（軽量化）
  const getAllUsers = async (): Promise<AdminUser[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50) // 軽量化のため50件に制限

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching users:', err)
      return []
    }
  }

  // 投稿統計を取得（軽量化）
  const getPostStats = async (): Promise<AdminPostStats[]> => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          created_at,
          updated_at,
          post_type,
          profiles (
            username,
            full_name,
            is_admin
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100) // 軽量化のため100件に制限

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching post stats:', err)
      return []
    }
  }

  // 管理者ユーザーを作成（軽量化）
  const createAdminUser = async (userData: CreateAdminUserData): Promise<{ error: string | null }> => {
    try {
      // 認証ユーザーを作成
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
          is_admin: true
        }
      })

      if (authError) {
        return { error: authError.message }
      }

      // プロフィールを作成
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: userData.username || userData.email.split('@')[0],
          full_name: userData.full_name,
          is_admin: true
        })

      if (profileError) {
        return { error: profileError.message }
      }

      return { error: null }
    } catch (err) {
      return { error: '管理者ユーザーの作成に失敗しました' }
    }
  }

  // ユーザーの管理者権限を切り替え（軽量化）
  const toggleAdminStatus = async (userId: string, isAdmin: boolean): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: isAdmin })
        .eq('id', userId)

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (err) {
      return { error: '管理者権限の更新に失敗しました' }
    }
  }

  // ユーザーを削除（軽量化）
  const deleteUser = async (userId: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (err) {
      return { error: 'ユーザーの削除に失敗しました' }
    }
  }

  // 投稿を削除（軽量化）
  const deletePost = async (postId: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (err) {
      return { error: '投稿の削除に失敗しました' }
    }
  }

  return {
    isAdmin,
    loading,
    error,
    getAdminUsers,
    getAllUsers,
    getPostStats,
    createAdminUser,
    toggleAdminStatus,
    deleteUser,
    deletePost,
  }
}