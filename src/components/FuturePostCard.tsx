'use client'

import { useState, useEffect, useRef } from 'react'
import { Post } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { usePosts } from '@/hooks/usePosts'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Edit, Trash2, Calendar, User, X, ZoomIn, Images, Heart, MessageCircle, Send, ChevronLeft, ChevronRight } from 'lucide-react'
import PostForm from './PostForm'
import LikeButton from './LikeButton'
import CommentSection from './CommentSection'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth()
  const { deletePost } = usePosts()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  
  const cardRef = useRef<HTMLDivElement>(null)
  const isOwner = user?.id === post.user_id

  const images = (post as any).image_urls || (post.image_url ? [post.image_url] : [])

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      setIsAdmin(data?.is_admin || false)
    }
    checkAdmin()
  }, [user])

  const handleDelete = async () => {
    if (!confirm('この投稿を削除しますか？')) return
    setIsDeleting(true)
    const { error } = await deletePost(post.id)
    if (error) alert('削除に失敗しました: ' + error)
    setIsDeleting(false)
  }

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

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`)
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

  return (
    <>
      {/* カード本体 */}
      <div 
        ref={cardRef}
        className="relative overflow-hidden cursor-pointer h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
            style={{
              borderRadius: '32px',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: 'translateZ(0)',
              height: '100%'
            }}
      >
        {/* カード背景 - グラスモーフィズム */}
        <div 
          className="p-6 border-2 h-full flex flex-col"
          style={{ 
            background: 'linear-gradient(135deg, rgba(250, 253, 255, 0.95) 0%, rgba(250, 253, 255, 0.85) 100%)',
            borderColor: isHovered ? '#FFC700' : 'rgba(255, 199, 0, 0.3)',
            borderRadius: '32px',
            boxShadow: isHovered 
              ? '0 20px 60px rgba(255, 199, 0, 0.3), 0 0 0 2px rgba(255, 199, 0, 0.5)' 
              : '0 8px 32px rgba(1, 22, 35, 0.12)',
            backdropFilter: 'blur(20px)',
            transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
            minHeight: '100%'
          }}
        >
          {/* 複数画像バッジ */}
          {images.length > 1 && (
            <div className="absolute top-4 right-16 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ 
                backgroundColor: '#E53647',
                color: '#FAFDFF',
                boxShadow: '0 4px 20px rgba(229, 54, 71, 0.5)'
              }}>
              <Images className="w-4 h-4" />
              <span className="text-sm font-bold japanese">{images.length}</span>
            </div>
          )}

          {/* 編集・削除ボタン */}
          {(isOwner || isAdmin) && (
            <div 
              className="absolute top-4 right-4 z-20 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-full transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
              >
                <Edit className="w-4 h-4" style={{ color: '#6366F1' }} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-full transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(229, 54, 71, 0.1)' }}
              >
                <Trash2 className="w-4 h-4" style={{ color: '#E53647' }} />
              </button>
            </div>
          )}

          {/* ユーザー情報 */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center border-3 shadow-lg"
              style={{ backgroundColor: '#FFC700', borderColor: '#F69111' }}>
              {post.profiles?.avatar_url ? (
                <img src={post.profiles.avatar_url} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <User className="w-7 h-7" style={{ color: '#011623' }} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg japanese" style={{ color: '#011623' }}>
                {post.profiles?.full_name || post.profiles?.username || '不明なユーザー'}
              </h3>
              <div className="flex items-center text-sm japanese" style={{ color: '#F69111' }}>
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(post.created_at)}
              </div>
            </div>
          </div>

          {/* タイトル */}
          <h2 className="text-xl font-bold mb-3 japanese line-clamp-2" style={{ color: '#011623', minHeight: '56px' }}>
            {post.title}
          </h2>

          {/* 本文 */}
          {post.content && (
            <div className="mb-4 whitespace-pre-wrap japanese line-clamp-2" style={{ color: '#011623', minHeight: '48px' }}>
              {post.content}
            </div>
          )}

          {/* 画像プレビュー */}
          {images.length > 0 && (
            <div className="mb-4" style={{ height: '180px', overflow: 'hidden' }}>
              {images.length === 1 ? (
                <div className="overflow-hidden rounded-2xl h-full">
                  <img
                    src={images[0]}
                    alt={post.title}
                    className="w-full h-full object-cover rounded-2xl"
                    style={{
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 h-full">
                  {images.slice(0, 4).map((url: string, idx: number) => (
                    <div key={idx} className="relative overflow-hidden"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex(idx)
                        setShowImageModal(true)
                      }}>
                      <img
                        src={url}
                        alt={`${post.title} ${idx + 1}`}
                        className="w-full h-full object-cover rounded-xl hover:scale-110 transition-transform duration-300"
                      />
                      {idx === 3 && images.length > 4 && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl">
                          <span className="text-white text-xl font-bold japanese">+{images.length - 4}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* いいね・コメント - 下部に固定 */}
          <div className="mt-auto pt-4 border-t-2" style={{ borderColor: '#FFC700' }}>
            <div className="flex items-center gap-3">
              <LikeButton postId={post.id} />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowComments(!showComments)
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
                style={{ 
                  backgroundColor: 'rgba(148, 163, 184, 0.1)',
                  color: '#011623'
                }}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-bold japanese">コメント</span>
              </button>
            </div>

            {/* コメントセクション */}
            {showComments && (
              <div className="mt-4" onClick={(e) => e.stopPropagation()}>
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
    </>
  )
}

