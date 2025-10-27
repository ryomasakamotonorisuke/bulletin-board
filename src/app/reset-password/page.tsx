'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isValidSession, setIsValidSession] = useState(false)
  
  const { updatePassword } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // URLパラメータからアクセストークンを確認
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    
    if (accessToken && refreshToken) {
      setIsValidSession(true)
    } else {
      setError('無効なリセットリンクです。')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password || !confirmPassword) {
      setError('すべての項目を入力してください')
      return
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await updatePassword(password)
    
    if (error) {
      setError(error.message)
    } else {
      setMessage('パスワードが正常に更新されました。ログインページにリダイレクトします...')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
    
    setLoading(false)
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">無効なリセットリンクです</div>
          <p className="text-gray-600 mb-4">パスワードリセット用のリンクが無効または期限切れです。</p>
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-800"
          >
            ログインページに戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            新しいパスワードを設定
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            新しいパスワードを入力してください
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              新しいパスワード
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="新しいパスワード（6文字以上）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード確認
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード確認"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {message && (
            <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-md flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? '更新中...' : 'パスワードを更新'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


