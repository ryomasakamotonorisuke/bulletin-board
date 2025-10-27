'use client'

import { useState } from 'react'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { UserPlus, Eye, EyeOff, Shield } from 'lucide-react'

export default function CreateAdminForm() {
  const [user_id, setUser_id] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [employee_id, setEmployee_id] = useState('')
  const [department, setDepartment] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { createUser } = useAdminUsers()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user_id || !password || !fullName) {
      setMessage('必須項目を入力してください')
      return
    }

    setLoading(true)
    setMessage('')

    const result = await createUser({
      user_id,
      password,
      full_name: fullName,
      username: username || undefined,
      is_admin: isAdmin,
      is_employee: true,
      employee_id: employee_id || undefined,
      department: department || undefined,
    })

    if (result.success) {
      setMessage(result.message)
      // フォームをリセット
      setUser_id('')
      setPassword('')
      setFullName('')
      setUsername('')
      setEmployee_id('')
      setDepartment('')
      setIsAdmin(false)
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
          <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1 japanese">
            ユーザーID *
          </label>
          <input
            type="text"
            id="user_id"
            value={user_id}
            onChange={(e) => setUser_id(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 japanese"
            placeholder="user001"
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

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isAdmin" className="ml-2 block text-sm font-medium text-gray-700 japanese">
            管理者権限を付与
          </label>
        </div>

        <div>
          <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-1 japanese">
            社員番号（任意）
          </label>
          <input
            type="text"
            id="employee_id"
            value={employee_id}
            onChange={(e) => setEmployee_id(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="E001"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1 japanese">
            部署（任意）
          </label>
          <input
            type="text"
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 japanese"
            placeholder="営業部"
          />
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

