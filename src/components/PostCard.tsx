'use client'

import { useState, useEffect } from 'react'
import { Post } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { usePosts } from '@/hooks/usePosts'
import { supabase } from '@/lib/supabase'
import { Edit, Trash2, Calendar, User, X, ZoomIn, Images, ChevronLeft, ChevronRight } from 'lucide-react'
import PostForm from './PostForm'
import LikeButton from './LikeButton'
import CommentSection from './CommentSection'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth()
  const { deletePost } = usePosts()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showFullModal, setShowFullModal] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const isOwner = user?.id === post.user_id
  const [showComments, setShowComments] = useState(false)

  // 管理者権限をチェック
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
    if (error) {
      alert('削除に失敗しました: ' + error)
    }
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

  const handleCardClick = () => {
    if (cardRef) {
      // アニメーション用のメジャー
      const rect = cardRef.getBoundingClientRect()
      const startPos = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
      
      setIsAnimating(true)
      setShowFullModal(true)
      setCurrentImageIndex(0)
      
      // アニメーション完了後にリセット
      setTimeout(() => setIsAnimating(false), 600)
    } else {
      setShowFullModal(true)
    }
  }
  
  const images = (post as any).image_urls || (post.image_url ? [post.image_url] : [])

  return (
    <>
    <div 
      ref={setCardRef}
      className="glass-card p-4 sm:p-5 md:p-6 border-2 hover:glow-effect cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-primary-yellow"
      style={{ 
        background: 'linear-gradient(135deg, rgba(250, 253, 255, 0.95) 0%, rgba(250, 253, 255, 0.9) 100%)',
        borderColor: '#FFC700',
        borderRadius: '20px sm:24px md:32px',
        boxShadow: '0 12px 40px rgba(1, 22, 35, 0.12), 0 0 0 1px rgba(255, 199, 0, 0.1)',
        backdropFilter: 'blur(20px)'
      }}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2"
            style={{ backgroundColor: '#FFC700' }}
          >
            {post.profiles?.avatar_url ? (
              <img
                src={post.profiles.avatar_url}
                alt={post.profiles.full_name || post.profiles.username || ''}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#011623' }} />
            )}
          </div>
          <div>
            <h3 className="font-medium text-sm sm:text-base japanese" style={{ color: '#011623' }}>
              {post.profiles?.full_name || post.profiles?.username || '不明なユーザー'}
            </h3>
            <div className="flex items-center text-xs sm:text-sm japanese" style={{ color: '#F69111' }}>
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {formatDate(post.created_at)}
            </div>
          </div>
        </div>

        {(isOwner || isAdmin) && (
          <div 
            className="flex space-x-1 sm:space-x-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-indigo-600 transition-colors"
              title={isAdmin && !isOwner ? "管理者権限で編集" : "編集"}
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title={isAdmin && !isOwner ? "管理者権限で削除" : "削除"}
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}
      </div>

      <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 japanese" style={{ color: '#011623' }}>
        {post.title}
        {images.length > 1 && (
          <span className="ml-2 inline-flex items-center text-xs sm:text-sm" style={{ color: '#F69111' }}>
            <Images className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            {images.length}枚
          </span>
        )}
      </h2>

      {post.content && (
        <div className="mb-3 sm:mb-4 whitespace-pre-wrap text-sm sm:text-base japanese" style={{ color: '#011623' }}>
          {post.content}
        </div>
      )}

      {/* 複数画像の表示 */}
      {(post.image_url || (post as any).image_urls?.length > 0) && (
        <div className="mb-4">
          {(() => {
            const images = (post as any).image_urls || (post.image_url ? [post.image_url] : [])
            
            if (images.length > 1) {
              // 複数画像の場合 - グリッド表示
              return (
                <div className="relative">
                  {/* 複数画像バッジ */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: '#E53647',
                      color: '#FAFDFF'
                    }}>
                    <Images className="w-3 h-3" />
                    <span className="text-xs font-bold japanese">{images.length}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {images.slice(0, 4).map((url: string, idx: number) => (
                      <div 
                        key={idx}
                        className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentImageIndex(idx)
                          setShowImageModal(true)
                        }}
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 199, 0, 0.1) 0%, rgba(246, 145, 17, 0.1) 100%)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)'
                          e.currentTarget.style.zIndex = '10'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'
                          e.currentTarget.style.zIndex = '1'
                        }}
                      >
                        <img
                          src={url}
                          alt={`${post.title} ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                        {idx === 3 && images.length > 4 && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-2xl">
                            <div className="text-center text-white">
                              <Images className="w-12 h-12 mx-auto mb-2" />
                              <span className="text-3xl font-bold japanese block">+{images.length - 4}</span>
                              <span className="text-lg japanese block">枚</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            } else {
              // 単一画像の場合
              return (
                <div className="overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl group cursor-pointer scale-in"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowImageModal(true)
                  }}>
                  <div 
                    className="relative rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 199, 0, 0.15) 0%, rgba(246, 145, 17, 0.15) 100%)',
                      minHeight: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <img
                      src={images[0]}
                      alt={post.title}
                      className="w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-contain"
                      onLoad={() => console.log('画像読み込み成功')}
                      onError={(e) => {
                        console.error('画像読み込み失敗')
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-3 sm:pb-4 md:pb-6">
                      <div className="flex items-center gap-2 sm:gap-3 text-white mb-2 sm:mb-3 md:mb-4">
                        <ZoomIn className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                        <span className="text-sm sm:text-base md:text-xl font-bold japanese">拡大表示</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          })()}
        </div>
      )}

      {post.updated_at !== post.created_at && (
        <div className="text-xs text-gray-400">
          編集済み: {formatDate(post.updated_at)}
        </div>
      )}

      {/* いいねとコメントボタン */}
      <div 
        className="flex items-center gap-2 mt-4 pt-4 border-t"
        onClick={(e) => e.stopPropagation()}
      >
        <LikeButton postId={post.id} />
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-medium">コメント</span>
        </button>
      </div>

      {/* コメントセクション */}
      {showComments && (
        <div onClick={(e) => e.stopPropagation()}>
          <CommentSection postId={post.id} />
        </div>
      )}

      {/* 詳細モーダル - レスポンシブ対応 */}
      {showFullModal && (
        <div 
          className="fixed inset-0 z-50 overflow-hidden"
          style={{ 
            backgroundColor: '#011623',
            backdropFilter: 'blur(20px)'
          }}
          onClick={() => setShowFullModal(false)}
        >
          <div 
            className={`w-screen h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 ${isAnimating ? 'hero-expand' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="h-[95vh] sm:h-[90vh] flex flex-col md:flex-row overflow-hidden w-full max-w-[95vw] md:max-w-[95vw] lg:max-w-6xl xl:max-w-7xl"
              style={{
                borderRadius: '20px sm:24px md:32px lg:40px',
                background: 'linear-gradient(135deg, rgba(250, 253, 255, 0.98) 0%, rgba(250, 253, 255, 0.95) 100%)',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 199, 0, 0.2)',
                backdropFilter: 'blur(40px)',
                border: '2px solid rgba(255, 199, 0, 0.3)'
              }}
            >
              {/* 閉じるボタン */}
              <button
                onClick={() => setShowFullModal(false)}
                className="absolute top-2 sm:top-4 md:top-8 right-2 sm:right-4 md:right-8 z-20 p-2 sm:p-2.5 md:p-3 rounded-full transition-all hover:scale-125"
                style={{ 
                  backgroundColor: 'rgba(1, 22, 35, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ color: '#011623' }} />
              </button>

              {/* 画像エリア - モバイルで上部、PCで左側 */}
              <div className="w-full md:w-1/2 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FAFDFF' }}>
              {images.length === 1 ? (
                <div className="h-full min-h-[200px] sm:min-h-[300px] flex items-center justify-center scale-in">
                  <img
                    src={images[0]}
                    alt={post.title}
                    className="max-w-full max-h-[60vh] sm:max-h-[70vh] md:max-h-full object-contain rounded-xl sm:rounded-2xl"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  {images.slice(0, 4).map((url: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="relative cursor-pointer transition-all hover:scale-105 rounded-xl sm:rounded-2xl overflow-hidden scale-in"
                      style={{ 
                        aspectRatio: '1',
                        animationDelay: `${idx * 0.1}s`
                      }}
                      onClick={() => {
                        setCurrentImageIndex(idx)
                        setShowImageModal(true)
                      }}
                    >
                      <img
                        src={url}
                        alt={`${post.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {idx === 3 && images.length > 4 && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Images className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 sm:mb-2" />
                            <span className="text-xl sm:text-2xl font-bold japanese block">{images.length - 4}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              </div>
            
              {/* コンテンツエリア - モバイルで下部、PCで右側 */}
              <div className="w-full md:w-1/2 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10" style={{ backgroundColor: 'rgba(250, 253, 255, 0.98)' }}>
                {/* 投稿ヘッダー */}
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2" style={{ backgroundColor: '#FFC700' }}>
                  {post.profiles?.avatar_url ? (
                    <img src={post.profiles.avatar_url} className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#011623' }} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base md:text-lg japanese" style={{ color: '#011623' }}>
                    {post.profiles?.full_name || post.profiles?.username || '不明なユーザー'}
                  </h3>
                  <div className="flex items-center text-xs sm:text-sm japanese" style={{ color: '#F69111' }}>
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {formatDate(post.created_at)}
                  </div>
                </div>
              </div>
              
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 japanese leading-tight" style={{ color: '#011623' }}>
                  {post.title}
                </h1>
              
                {post.content && (
                  <div className="mb-6 sm:mb-8 md:mb-10 whitespace-pre-wrap japanese text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed" style={{ color: '#011623' }}>
                    {post.content}
                  </div>
                )}
              
                {/* いいねとコメント */}
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6 md:pt-8 border-t-2" style={{ borderColor: '#FFC700' }}>
                <LikeButton postId={post.id} />
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg sm:rounded-xl transition-colors font-bold text-sm sm:text-base"
                  style={{ 
                    backgroundColor: '#F5F5F5',
                    color: '#011623'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0E0E0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-bold japanese">コメント</span>
                </button>
              </div>
              
                {showComments && (
                  <div className="mt-4 sm:mt-6 md:mt-8">
                    <CommentSection postId={post.id} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 画像モーダル */}
      {showImageModal && (() => {
        const currentImage = images[currentImageIndex]
        
        return currentImage && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(1, 22, 35, 0.95)' }}
            onClick={() => setShowImageModal(false)}
          >
            <div className="relative max-w-6xl max-h-full w-full">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-16 right-0 text-white hover:scale-110 transition-transform z-10"
              >
                <X className="w-10 h-10" />
              </button>
              
              {/* 前へボタン */}
              {images.length > 1 && currentImageIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(prev => prev - 1)
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* 次へボタン */}
              {images.length > 1 && currentImageIndex < images.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(prev => prev + 1)
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={currentImage}
                  alt={post.title}
                  className="max-w-full max-h-[85vh] object-contain mx-auto"
                  onClick={(e) => e.stopPropagation()}
                  onError={(e) => {
                    console.error('画像モーダル読み込み失敗')
                    setShowImageModal(false)
                  }}
                />
              </div>
              
              {/* 投稿情報と画像カウンター */}
              <div className="absolute bottom-0 left-0 right-0 text-center p-4 text-white backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <h3 className="text-lg font-bold japanese mb-1">{post.title}</h3>
                <p className="text-sm opacity-80 japanese mb-2">{post.profiles?.full_name || post.profiles?.username || '不明なユーザー'}</p>
                {images.length > 1 && (
                  <p className="text-xs opacity-60 japanese">{currentImageIndex + 1}/{images.length}</p>
                )}
              </div>
            </div>
          </div>
        )
      })()}
    </div>
    </>
  )
}
