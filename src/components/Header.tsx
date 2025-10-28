'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAdmin } from '@/hooks/useAdmin'
import { LogOut, Plus, User, Shield, Search, Filter, RefreshCw, Settings } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  onNewPost: () => void
  searchTerm: string
  onSearchChange: (value: string) => void
  sortBy: 'newest' | 'oldest' | 'likes'
  onSortChange: (value: 'newest' | 'oldest' | 'likes') => void
  activeView: 'all' | 'popular' | 'user' | 'store'
  onViewChange: (view: 'all' | 'popular' | 'user' | 'store') => void
  onRefresh?: () => void
}

export default function Header({ 
  onNewPost, 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  activeView, 
  onViewChange,
  onRefresh 
}: HeaderProps) {
  const { user, signOut } = useAuth()
  const { isAdmin } = useAdmin()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  return (
    <header 
      className="sticky top-0 z-50 border-b-2"
      style={{ 
        background: 'linear-gradient(135deg, rgba(250, 253, 255, 0.98) 0%, rgba(250, 253, 255, 0.95) 100%)',
        backdropFilter: 'blur(30px)',
        borderColor: '#FFC700',
        boxShadow: '0 4px 30px rgba(255, 199, 0, 0.15)'
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        {/* 上部: ロゴとメニュー */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src="/mascot.png" 
              alt="ロゴ" 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
            />
            <h1 
              className="text-lg sm:text-xl md:text-2xl font-bold japanese"
              style={{ color: '#F69111' }}
            >
              社内掲示板
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onNewPost}
              className="flex items-center px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 font-bold japanese shadow-lg hover:scale-105 hover:shadow-xl text-xs sm:text-sm md:text-base"
              style={{ 
                background: 'linear-gradient(135deg, #FFC700 0%, #F69111 100%)',
                color: '#011623',
                borderRadius: '16px',
                boxShadow: '0 8px 20px rgba(255, 199, 0, 0.3)'
              }}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">新しい投稿</span>
              <span className="sm:hidden">投稿</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 focus:outline-none"
                style={{ color: '#011623' }}
              >
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#FFC700' }}
                >
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name || user.username || 'ユーザー'}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#011623' }} />
                  )}
                </div>
                <span className="hidden lg:block text-xs sm:text-sm font-medium japanese" style={{ color: '#011623' }}>
                  {user?.full_name || user?.username || 'ユーザー'}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{user?.full_name || 'ユーザー'}</div>
                    <div className="text-gray-500 text-xs">{user?.email}</div>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    アカウント設定
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      管理者ページ
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 下部: 検索・ソート・タブ */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {/* 検索とソート */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#F69111' }} />
              <input
                type="text"
                placeholder="投稿を検索..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow japanese text-sm sm:text-base"
                style={{ 
                  borderColor: '#FFC700',
                  borderRadius: '16px'
                }}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'likes')}
              className="px-3 sm:px-4 py-2 sm:py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-yellow japanese text-sm sm:text-base"
              style={{ 
                borderColor: '#FFC700',
                borderRadius: '16px'
              }}
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
              <option value="likes">人気順</option>
            </select>
          </div>
          
          {/* タブ */}
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={() => onViewChange('all')}
              className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm japanese font-bold ${
                activeView === 'all' ? 'shadow-md' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={activeView === 'all' ? { 
                background: 'linear-gradient(135deg, #FFC700 0%, #F69111 100%)',
                color: '#011623'
              } : {}}
            >
              すべて
            </button>
            <button
              onClick={() => onViewChange('user')}
              className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm japanese font-bold ${
                activeView === 'user' ? 'shadow-md' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={activeView === 'user' ? { 
                background: 'linear-gradient(135deg, #FFC700 0%, #F69111 100%)',
                color: '#011623'
              } : {}}
            >
              <span className="hidden sm:inline">ユーザー投稿</span>
              <span className="sm:hidden">ユーザー</span>
            </button>
            <button
              onClick={() => onViewChange('store')}
              className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm japanese font-bold ${
                activeView === 'store' ? 'shadow-md' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={activeView === 'store' ? { 
                background: 'linear-gradient(135deg, #FFC700 0%, #F69111 100%)',
                color: '#011623'
              } : {}}
            >
              <span className="hidden sm:inline">店舗投稿</span>
              <span className="sm:hidden">店舗</span>
            </button>
            <button
              onClick={() => onViewChange('popular')}
              className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm japanese font-bold ${
                activeView === 'popular' ? 'shadow-md' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={activeView === 'popular' ? { 
                background: 'linear-gradient(135deg, #FFC700 0%, #F69111 100%)',
                color: '#011623'
              } : {}}
            >
              <span className="hidden sm:inline">人気投稿</span>
              <span className="sm:hidden">人気</span>
            </button>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-bold"
                style={{ 
                  backgroundColor: '#BBCF00',
                  color: '#011623'
                }}
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 inline" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
