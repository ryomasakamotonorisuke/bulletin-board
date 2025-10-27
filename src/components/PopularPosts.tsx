'use client'

import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import PostCard from './PostCard'

interface PopularPost {
  id: string
  user_id: string
  title: string
  content: string | null
  image_url: string | null
  image_urls?: string[] | null
  post_type: 'user' | 'store'
  created_at: string
  updated_at: string
  like_count: number
  comment_count: number
  profiles?: {
    full_name: string | null
    username: string | null
    avatar_url: string | null
  }
}

export default function PopularPosts() {
  const [posts, setPosts] = useState<PopularPost[]>([])
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day')

  useEffect(() => {
    fetchPopularPosts()
  }, [period])

  const fetchPopularPosts = async () => {
    setLoading(true)
    
    let startDate: Date
    const endDate = new Date()
    
    switch (period) {
      case 'day':
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000)
        break
      case 'week':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
    }

    const startISO = startDate.toISOString()

    // 投稿、いいね、コメント、プロフィールを結合して取得
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          full_name,
          username
        )
      `)
      .gte('created_at', startISO)
      .order('created_at', { ascending: false })

    if (!error && data) {
      // 各投稿のいいね数とコメント数を取得
      const postsWithStats = await Promise.all(
        data.map(async (post) => {
          const { count: likeCount } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id)
          
          const { count: commentCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id)

          return {
            ...post,
            like_count: likeCount || 0,
            comment_count: commentCount || 0,
          }
        })
      )

      // 人気度でソート（いいね数 + コメント数 * 2）
      postsWithStats.sort((a, b) => {
        const popularityA = a.like_count + a.comment_count * 2
        const popularityB = b.like_count + b.comment_count * 2
        return popularityB - popularityA
      })

      setPosts(postsWithStats.slice(0, 5)) // 上位5件
    }

    setLoading(false)
  }

  const periodLabels = {
    day: '今日',
    week: '今週',
    month: '今月',
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">読み込み中...</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-600">人気投稿がありません</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">人気投稿</h2>
        </div>
        
        <div className="flex gap-2">
          {(['day', 'week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

