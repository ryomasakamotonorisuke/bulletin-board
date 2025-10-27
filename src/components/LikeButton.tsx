'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface LikeButtonProps {
  postId: string
  initialLikeCount?: number
}

export default function LikeButton({ postId, initialLikeCount }: LikeButtonProps) {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0)

  useEffect(() => {
    const initialize = async () => {
      await checkIfLiked()
      await fetchLikeCount()
    }
    initialize()
  }, [user, postId])

  const fetchLikeCount = async () => {
    try {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
      
      if (count !== null) {
        setLikeCount(count)
      }
    } catch (error) {
      console.error('Error fetching like count:', error)
    }
  }

  const checkIfLiked = async () => {
    if (!user) {
      setIsLiked(false)
      return
    }

    try {
      const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle()

      setIsLiked(!!data)
    } catch (error) {
      console.error('Error checking if liked:', error)
      setIsLiked(false)
    }
  }

  const handleLike = async () => {
    if (!user) {
      alert('いいねするにはログインが必要です')
      return
    }

    if (isLiked) {
      // いいねを解除
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)

      if (!error) {
        setIsLiked(false)
        // 実際の数を取得して同期
        await fetchLikeCount()
      }
    } else {
      // いいねを追加
      const { error } = await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: user.id })

      if (!error) {
        setIsLiked(true)
        // 実際の数を取得して同期
        await fetchLikeCount()
      }
    }
  }

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
      style={{
        backgroundColor: isLiked ? '#E53647' : 'rgba(255, 255, 255, 0.8)',
        color: isLiked ? '#FAFDFF' : '#E53647',
        border: '2px solid #E53647',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)'
      }}
      onMouseEnter={(e) => {
        if (!isLiked) {
          e.currentTarget.style.backgroundColor = 'rgba(229, 54, 71, 0.1)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isLiked) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
    >
      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
      <span className="font-medium japanese">{likeCount}</span>
    </button>
  )
}

