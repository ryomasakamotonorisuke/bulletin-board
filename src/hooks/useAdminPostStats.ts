'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminPostStats } from '@/types'

interface ApiResult<T> {
  success: boolean
  data?: T
  message: string
}

export function useAdminPostStats() {
  const [postStats, setPostStats] = useState<AdminPostStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPostStats()
  }, [])

  const fetchPostStats = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          image_url,
          created_at,
          updated_at,
          user_id,
          profiles (
            username,
            full_name,
            is_admin
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setPostStats(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (postId: string): Promise<ApiResult<any>> => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) {
        return { success: false, message: error.message }
      }

      // 投稿リストから削除
      setPostStats(postStats.filter(post => post.id !== postId))

      return { success: true, message: '投稿を削除しました' }
    } catch (err: any) {
      return { success: false, message: '投稿の削除に失敗しました' }
    }
  }

  return {
    postStats,
    loading,
    error,
    deletePost,
    fetchPostStats
  }
}

