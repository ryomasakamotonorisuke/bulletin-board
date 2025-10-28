'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Lock, User, Mail, Save, X } from 'lucide-react'

export default function UserSettings() {
  const { user, updatePassword, signOut } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // バリデーション
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('すべての項目を入力してください')
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('新しいパスワードは6文字以上である必要があります')
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('新しいパスワードが一致しません')
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await updatePassword(currentPassword, newPassword)
      
      if (updateError) {
        setError(updateError.message || 'パスワードの変更に失敗しました')
      } else {
        setMessage('パスワードが正常に変更されました')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました')
    }
    
    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* ヘッダー */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 japanese">アカウント設定</h2>
          </div>

          <div className="p-6 space-y-8">
            {/* ユーザー情報 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 japanese">ユーザー情報</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <label className="text-sm font-medium text-gray-700 japanese">氏名</label>
                    <p className="text-gray-900">{user.full_name || '未設定'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <label className="text-sm font-medium text-gray-700 japanese">メールアドレス</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3" />
                  <div>
                    <label className="text-sm font-medium text-gray-700 japanese">ユーザー名</label>
                    <p className="text-gray-900">{user.username || '未設定'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* パスワード変更 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 japanese">パスワード変更</h3>
              
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 japanese">{error}</p>
                </div>
              )}

              {message && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600 japanese">{message}</p>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 japanese">
                    現在のパスワード
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 japanese">
                    新しいパスワード
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 japanese">
                    新しいパスワード確認
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 japanese"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? '変更中...' : 'パスワードを変更'}
                  </button>
                </div>
              </form>
            </div>

            {/* ログアウト */}
            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={handleSignOut}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 japanese"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

