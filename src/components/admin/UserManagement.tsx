'use client'

import { useState } from 'react'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { AdminUser } from '@/types'
import { Users, Shield, ShieldOff, Trash2, Calendar, Mail } from 'lucide-react'

export default function UserManagement() {
  const { users, loading, error, toggleAdminStatus, deleteUser } = useAdminUsers()
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    const result = await toggleAdminStatus(userId, !currentStatus)
    if (!result.success) {
      alert(result.message)
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`ユーザー「${userName}」を削除しますか？この操作は取り消せません。`)) {
      return
    }

    setDeletingUserId(userId)
    const result = await deleteUser(userId)
    setDeletingUserId(null)

    if (!result.success) {
      alert(result.message)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">ユーザー一覧を読み込み中...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">エラーが発生しました</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Users className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">ユーザー管理</h2>
        <span className="ml-4 text-sm text-gray-500">({users.length}人)</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ユーザー
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                管理者権限
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最終ログイン
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                登録日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user: AdminUser) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.full_name || '名前未設定'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {user.email}
                      </div>
                      {user.username && (
                        <div className="text-xs text-gray-400">
                          @{user.username}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_admin
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.is_admin ? (
                      <>
                        <Shield className="w-3 h-3 mr-1" />
                        管理者
                      </>
                    ) : (
                      <>
                        <ShieldOff className="w-3 h-3 mr-1" />
                        一般ユーザー
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : '未ログイン'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(user.created_at)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                     onClick={() => handleDeleteUser(user.id, user.full_name || user.email || '')}
                    disabled={deletingUserId === user.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">ユーザーがいません</h3>
          <p className="mt-1 text-sm text-gray-500">まず管理者ユーザーを作成してください。</p>
        </div>
      )}
    </div>
  )
}

