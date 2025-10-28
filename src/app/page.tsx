'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePosts } from '@/hooks/usePosts'
import { useUserRole } from '@/hooks/useUserRole'
import Header from '@/components/Header'
import PostCard from '@/components/FuturePostCard'
import PostForm from '@/components/PostForm'
import ModernLoginForm from '@/components/auth/ModernLoginForm'
import SignUpForm from '@/components/auth/SignUpForm'
import ModernForgotPasswordForm from '@/components/auth/ModernForgotPasswordForm'
import PopularPosts from '@/components/PopularPosts'
import { Search, Filter, Store, Users, Plus } from 'lucide-react'
import { canCreateUserPost, canCreateStorePost, getRoleDisplayName } from '@/lib/permissions'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const { posts, loading: postsLoading, error, fetchPostsSimple } = usePosts()
  const { userRole, loading: roleLoading } = useUserRole()
  const [showPostForm, setShowPostForm] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [activeView, setActiveView] = useState<'all' | 'popular' | 'user' | 'store'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'likes'>('newest')
  const [filteredPosts, setFilteredPosts] = useState(posts)

  // ユーザーがログインしたら一度だけ簡易取得を試行
  useEffect(() => {
    if (user && !postsLoading) {
      console.log('ユーザーログイン後、簡易取得を試行')
      fetchPostsSimple()
    }
  }, [user]) // postsLoadingとfetchPostsSimpleを依存配列から削除

  // 検索とソート機能
  useEffect(() => {
    let filtered = [...posts]

    // 投稿タイプフィルター
    if (activeView === 'user') {
      filtered = filtered.filter(post => (post as any).post_type === 'user')
    } else if (activeView === 'store') {
      filtered = filtered.filter(post => (post as any).post_type === 'store')
    }

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // ソート
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'likes':
        // いいね数でソート（後でいいね情報を取得して実装）
        break
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, sortBy, activeView])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    if (showForgotPassword) {
      return <ModernForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
    }

    return (
      <>
        {showSignUp ? (
          <SignUpForm />
        ) : (
          <ModernLoginForm 
            onForgotPassword={() => setShowForgotPassword(true)}
            onSignUp={() => setShowSignUp(true)}
          />
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFDFF' }}>
      <Header 
        onNewPost={() => setShowPostForm(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        activeView={activeView}
        onViewChange={setActiveView}
        onRefresh={fetchPostsSimple}
      />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {showPostForm && (
          <div className="mb-6">
            <PostForm
              onSuccess={async () => {
                setShowPostForm(false)
                // 投稿後に投稿リストを更新
                console.log('投稿フォーム閉じ、投稿リストを更新')
                await fetchPostsSimple()
              }}
              onCancel={() => setShowPostForm(false)}
              postType={activeView === 'store' ? 'store' : 'user'}
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 japanese">
              {activeView === 'all' && '投稿一覧'}
              {activeView === 'user' && 'ユーザー投稿'}
              {activeView === 'store' && '店舗投稿'}
              {activeView === 'popular' && '人気投稿'}
            </h2>
            
            {(activeView === 'all' || activeView === 'user' || activeView === 'store') && (
              <span className="text-sm text-gray-500 japanese">
                {filteredPosts.length}件の投稿
                {userRole && ` (${getRoleDisplayName(userRole)})`}
              </span>
            )}
          </div>

          {activeView === 'popular' ? (
            <PopularPosts />
          ) : postsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">投稿を読み込み中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">エラーが発生しました</div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 japanese">
                {activeView === 'user' && 'ユーザー投稿がありません'}
                {activeView === 'store' && '店舗投稿がありません'}
                {activeView === 'all' && 'まだ投稿がありません'}
              </h3>
              <p className="text-gray-600 mb-4 japanese">
                {activeView === 'user' && '管理者または投稿者としてログインして投稿してください'}
                {activeView === 'store' && '店舗アカウントとしてログインして投稿してください'}
                {activeView === 'all' && '最初の投稿を作成してみましょう！'}
              </p>
              {((activeView === 'user' && canCreateUserPost(userRole)) ||
                (activeView === 'store' && canCreateStorePost(userRole))) && (
                <button
                  onClick={() => setShowPostForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  投稿を作成
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
                {filteredPosts.map((post, idx) => (
                  <div 
                    key={post.id} 
                    className="scale-in h-full"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 japanese">
                    {activeView === 'user' && 'ユーザー投稿はありません'}
                    {activeView === 'store' && '店舗投稿はありません'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}