'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { usePosts } from '@/hooks/usePosts'
import { supabase } from '@/lib/supabase'
import { Calendar, User, X, Images, ChevronLeft, ChevronRight, Edit, Trash2, MessageCircle } from 'lucide-react'
import LikeButton from '@/components/LikeButton'
import CommentSection from '@/components/CommentSection'
import PostForm from '@/components/PostForm'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('id', params.id)
        .single()

      if (data) setPost(data)
      setLoading(false)
    }

    const checkAdmin = async () => {
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      setIsAdmin(data?.is_admin || false)
    }

    if (params.id) {
      fetchPost()
      checkAdmin()
    }
  }, [params.id, user])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const images = post?.image_urls || (post?.image_url ? [post.image_url] : [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFDFF' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#FFC700' }}></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFDFF' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 japanese" style={{ color: '#011623' }}>投稿が見つかりません</h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl font-bold japanese"
            style={{ backgroundColor: '#FFC700', color: '#011623' }}
          >
            戻る
          </button>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <PostForm
        initialData={{
          id: post.id,
          title: post.title,
          content: post.content || '',
          image_url: post.image_url || undefined,
        }}
        isEditing={true}
        onSuccess={() => setIsEditing(false)}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  const isOwner = user?.id === post.user_id

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#011623' }}>
      {/* 背景ビューポート */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div 
          className="h-[92vh] flex flex-row overflow-hidden"
          style={{
            width: '96vw',
            maxWidth: '1600px',
            borderRadius: '48px',
            background: 'linear-gradient(135deg, rgba(250, 253, 255, 0.98) 0%, rgba(250, 253, 255, 0.95) 100%)',
            boxShadow: '0 40px 100px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 199, 0, 0.3)',
            backdropFilter: 'blur(40px)'
          }}
        >
          {/* 閉じるボタン */}
          <button
            onClick={() => router.push('/')}
            className="absolute top-6 left-6 z-20 p-3 rounded-full transition-all hover:scale-125"
            style={{ 
              backgroundColor: 'rgba(1, 22, 35, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <X className="w-7 h-7" style={{ color: '#011623' }} />
          </button>

          {/* 編集・削除ボタン */}
          {(isOwner || isAdmin) && (
            <div className="absolute top-6 right-20 z-20 flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-3 rounded-full transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)' }}
              >
                <Edit className="w-6 h-6" style={{ color: '#6366F1' }} />
              </button>
            </div>
          )}

          {/* 左側: 画像 - 50% */}
          <div className="w-1/2 overflow-y-auto p-8" style={{ backgroundColor: '#FAFDFF' }}>
            {images.length === 1 ? (
              <div className="h-full flex items-center justify-center">
                <img
                  src={images[0]}
                  alt={post.title}
                  className="max-w-full max-h-full object-contain rounded-3xl"
                />
              </div>
            ) : images.length === 2 ? (
              <div className="grid grid-cols-1 gap-4 h-full">
                {images.map((url: string, idx: number) => (
                  <div 
                    key={idx}
                    className="flex-1 rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br from-primary-yellow/20 to-primary-orange/20"
                    onClick={() => {
                      setCurrentImageIndex(idx)
                      setShowImageModal(true)
                    }}
                  >
                    <img
                      src={url}
                      alt={`${post.title} ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {images.map((url: string, idx: number) => (
                  <div 
                    key={idx}
                    className="relative aspect-square rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br from-primary-yellow/20 to-primary-orange/20"
                    onClick={() => {
                      setCurrentImageIndex(idx)
                      setShowImageModal(true)
                    }}
                  >
                    <img
                      src={url}
                      alt={`${post.title} ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    {idx === 3 && images.length > 4 && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Images className="w-12 h-12 mx-auto mb-2" />
                          <span className="text-3xl font-bold japanese block">+{images.length - 4}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 右側: コンテンツ - 50% */}
          <div className="w-1/2 overflow-y-auto p-12" style={{ backgroundColor: 'rgba(250, 253, 255, 0.98)' }}>
            {/* 投稿ヘッダー */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-3 shadow-lg"
                style={{ backgroundColor: '#FFC700', borderColor: '#F69111' }}>
                {post.profiles?.avatar_url ? (
                  <img src={post.profiles.avatar_url} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <User className="w-8 h-8" style={{ color: '#011623' }} />
                )}
              </div>
              <div>
                <h3 className="font-bold text-xl japanese" style={{ color: '#011623' }}>
                  {post.profiles?.full_name || post.profiles?.username || '不明なユーザー'}
                </h3>
                <div className="flex items-center text-sm japanese" style={{ color: '#F69111' }}>
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(post.created_at)}
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-10 japanese leading-tight" style={{ color: '#011623' }}>
              {post.title}
            </h1>
            
            {post.content && (
              <div className="mb-12 whitespace-pre-wrap japanese text-2xl leading-relaxed" style={{ color: '#011623' }}>
                {post.content}
              </div>
            )}
            
            {/* いいねとコメント */}
            <div className="flex items-center gap-6 pt-8 border-t-2" style={{ borderColor: '#FFC700' }}>
              <LikeButton postId={post.id} />
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl transition-all hover:scale-105 font-bold"
                style={{ 
                  backgroundColor: '#F5F5F5',
                  color: '#011623'
                }}
              >
                <MessageCircle className="w-6 h-6" />
                <span className="font-bold japanese text-lg">コメント</span>
              </button>
            </div>
            
            {showComments && (
              <div className="mt-8">
                <CommentSection postId={post.id} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 画像拡大モーダル */}
      {showImageModal && images.length > 0 && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(1, 22, 35, 0.95)' }}
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-20 right-0 text-white hover:scale-110 transition-transform z-10"
            >
              <X className="w-12 h-12" />
            </button>
            
            {images.length > 1 && currentImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex(prev => prev - 1)
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-4 rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
            
            {images.length > 1 && currentImageIndex < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex(prev => prev + 1)
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-4 rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
            
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={images[currentImageIndex]}
                alt={post.title}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 text-center p-6 text-white backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <h3 className="text-xl font-bold japanese mb-2">{post.title}</h3>
              <p className="text-sm opacity-80 japanese mb-2">{post.profiles?.full_name || '不明なユーザー'}</p>
              {images.length > 1 && (
                <p className="text-xs opacity-60 japanese">{currentImageIndex + 1}/{images.length}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

