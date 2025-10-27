'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  profiles?: {
    full_name: string | null
    username: string | null
  }
}

interface CommentSectionProps {
  postId: string
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (
          full_name,
          username
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setComments(data as Comment[])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setIsSubmitting(true)
    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: newComment.trim(),
      })

    if (!error) {
      setNewComment('')
      fetchComments()
    } else {
      alert('コメントの投稿に失敗しました')
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('このコメントを削除しますか？')) return

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (!error) {
      fetchComments()
    } else {
      alert('コメントの削除に失敗しました')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-gray-600" />
        <h3 className="font-medium text-gray-900">
          コメント ({comments.length})
        </h3>
      </div>

      {/* コメントフォーム */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="コメントを入力..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={2}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            コメントを投稿
          </button>
        </form>
      )}

      {/* コメント一覧 */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {comment.profiles?.full_name || comment.profiles?.username || '匿名'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{comment.content}</p>
              </div>
              {user?.id === comment.user_id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="削除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-center text-gray-500 text-sm py-4">
          まだコメントがありません
        </p>
      )}
    </div>
  )
}

