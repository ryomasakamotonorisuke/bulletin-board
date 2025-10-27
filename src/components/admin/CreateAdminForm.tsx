'use client'

import { useState } from 'react'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { UserPlus, Eye, EyeOff, Shield } from 'lucide-react'

export default function CreateAdminForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [userRole, setUserRole] = useState<'admin' | 'poster' | 'viewer' | 'store'>('viewer')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { createUser } = useAdminUsers()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !fullName) {
      setMessage('必須項目を入力してください')
      return
    }

    setLoading(true)
    setMessage('')

    const result = await createUser({
      email,
      password,
      full_name: fullName,
      username: username || undefined,
      role: userRole,
      is_employee: true
    })

    if (result.success) {
      setMessage(result.message)
      // フォームをリセット
      setEmail('')
      setPassword('')
      setFullName('')
      setUsername('')
      setUserRole('viewer')
    } else {
      setMessage(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <UserPlus className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900 japanese">ユーザー作成</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="user@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="6文字以上のパスワード"
              minLength={6}
              required
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
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            氏名 *
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="山田 太郎"
            required
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            ユーザー名（任意）
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="user123"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 japanese">
            ユーザー種別 *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: 'admin', label: '管理者' },
              { value: 'poster', label: '投稿者' },
              { value: 'viewer', label: '閲覧者' },
              { value: 'store', label: '店舗' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setUserRole(option.value as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  userRole === option.value
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } japanese`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div className={`text-sm p-3 rounded-md ${
            message.includes('成功') || message.includes('作成されました') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? '作成中...' : 'ユーザーを作成'}
        </button>
      </form>
    </div>
  )
}

