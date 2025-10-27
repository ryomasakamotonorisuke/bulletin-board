'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminUser } from '@/types'

interface ApiResult<T> {
  success: boolean
  data?: T
  message: string
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminStatus = async (userId: string, isAdmin: boolean): Promise<ApiResult<any>> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: isAdmin })
        .eq('id', userId)

      if (error) {
        return { success: false, message: error.message }
      }

      // ユーザーリストを更新
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: isAdmin } : user
      ))

      return { success: true, message: '管理者権限を更新しました' }
    } catch (err: any) {
      return { success: false, message: '管理者権限の更新に失敗しました' }
    }
  }

  const deleteUser = async (userId: string): Promise<ApiResult<any>> => {
    try {
      // Supabase Admin APIを使用してユーザーを削除
      const { error: authError } = await supabase.auth.admin.deleteUser(userId)
      
      if (authError) {
        return { success: false, message: authError.message }
      }

      // プロフィールを削除
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (profileError) {
        return { success: false, message: profileError.message }
      }

      // ユーザーリストから削除
      setUsers(users.filter(user => user.id !== userId))

      return { success: true, message: 'ユーザーを削除しました' }
    } catch (err: any) {
      return { success: false, message: 'ユーザーの削除に失敗しました' }
    }
  }

  const createAdminUser = async (userData: {
    email: string
    password: string
    full_name: string
    username?: string
  }): Promise<ApiResult<any>> => {
    try {
      // Supabase Admin APIを使用してユーザーを作成
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
        }
      })

      if (authError) {
        return { success: false, message: authError.message }
      }

      // プロフィールを作成
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: userData.username || userData.email.split('@')[0],
          full_name: userData.full_name,
          is_admin: true,
          is_employee: true
        })

      if (profileError) {
        return { success: false, message: profileError.message }
      }

      // ユーザーリストを更新
      await fetchUsers()

      return { success: true, message: '管理者ユーザーを作成しました' }
    } catch (err: any) {
      return { success: false, message: '管理者ユーザーの作成に失敗しました' }
    }
  }

  const createUser = async (userData: {
    user_id: string
    password: string
    full_name: string
    username?: string
    is_admin?: boolean
    is_employee?: boolean
    employee_id?: string
    department?: string
  }): Promise<ApiResult<any>> => {
    try {
      // Supabase Admin APIを使用してユーザーを作成（user_idをメールとして扱う）
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.user_id,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
        }
      })

      if (authError) {
        return { success: false, message: authError.message }
      }

      // プロフィールを作成
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          user_id: userData.user_id,
          username: userData.username || userData.user_id,
          full_name: userData.full_name,
          is_admin: userData.is_admin || false,
          is_employee: userData.is_employee !== undefined ? userData.is_employee : true,
          employee_id: userData.employee_id,
          department: userData.department,
          is_active: true,
          password_changed: false // 初回ログイン時に強制的に変更
        })

      if (profileError) {
        return { success: false, message: profileError.message }
      }

      // ユーザーリストを更新
      await fetchUsers()

      return { success: true, message: 'ユーザーを作成しました（初回ログイン時にパスワード変更が必要です）' }
    } catch (err: any) {
      return { success: false, message: 'ユーザーの作成に失敗しました' }
    }
  }

  return {
    users,
    loading,
    error,
    toggleAdminStatus,
    deleteUser,
    createAdminUser,
    createUser,
    fetchUsers
  }
}

