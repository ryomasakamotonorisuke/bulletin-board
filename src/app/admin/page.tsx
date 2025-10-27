'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useAdmin } from '@/hooks/useAdmin'
import CreateAdminForm from '@/components/admin/CreateAdminForm'
import UserManagement from '@/components/admin/UserManagement'
import PostManagement from '@/components/admin/PostManagement'
import Dashboard from '@/components/admin/Dashboard'
import { Shield, Users, FileText, ArrowLeft, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading, error } = useAdmin()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create' | 'users' | 'posts' | 'invite'>('dashboard')

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">ログインが必要です</div>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            ログインページに戻る
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">エラーが発生しました</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            ホームに戻る
          </Link>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <div className="text-red-600 mb-4">管理者権限が必要です</div>
          <p className="text-gray-600 mb-4">このページにアクセスするには管理者権限が必要です。</p>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            ホームに戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="w-4 h-4 mr-1" />
                戻る
              </Link>
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-indigo-600 mr-2" />
                <h1 className="text-xl font-bold text-gray-900">管理者ダッシュボード</h1>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              管理者: {user.full_name || user.username || user.email}
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* タブナビゲーション */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              ダッシュボード
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-1" />
              ユーザー作成
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-1" />
              ユーザー管理
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-1" />
              投稿管理
            </button>
          </nav>
        </div>

        {/* タブコンテンツ */}
        <div className="space-y-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'create' && <CreateAdminForm />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'posts' && <PostManagement />}
        </div>
      </main>
    </div>
  )
}

