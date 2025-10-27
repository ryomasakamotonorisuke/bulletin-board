'use client'

import { useState } from 'react'
import { useAdminPostStats } from '@/hooks/useAdminPostStats'
import { AdminPostStats } from '@/types'
import { FileText, Image, Trash2, Calendar, User, Shield } from 'lucide-react'

export default function PostManagement() {
  const { postStats, loading, error, deletePost } = useAdminPostStats()
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)

  const handleDeletePost = async (postId: string, postTitle: string) => {
    if (!confirm(`投稿「${postTitle}」を削除しますか？この操作は取り消せません。`)) {
      return
    }

    setDeletingPostId(postId)
    const result = await deletePost(postId)
    setDeletingPostId(null)

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
          <span className="ml-2 text-gray-600">投稿一覧を読み込み中...</span>
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
        <FileText className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">投稿管理</h2>
        <span className="ml-4 text-sm text-gray-500">({postStats.length}件)</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                投稿
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                投稿者
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                タイプ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                作成日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {postStats.map((post: AdminPostStats) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                    {post.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {post.id.substring(0, 8)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-indigo-600">
                          {post.profiles?.full_name?.charAt(0) || post.profiles?.username?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {post.profiles?.full_name || post.profiles?.username || '不明なユーザー'}
                        {post.is_admin && (
                          <Shield className="w-3 h-3 ml-1 text-indigo-600" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {post.username && `@${post.username}`}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.post_type === '画像付き'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {post.post_type === '画像付き' ? (
                      <>
                        <Image className="w-3 h-3 mr-1" />
                        画像付き
                      </>
                    ) : (
                      <>
                        <FileText className="w-3 h-3 mr-1" />
                        テキストのみ
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(post.created_at)}
                  </div>
                   {post.updated_at && post.updated_at !== post.created_at && (
                     <div className="text-xs text-gray-400">
                       編集済み: {formatDate(post.updated_at)}
                     </div>
                   )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeletePost(post.id, post.title)}
                    disabled={deletingPostId === post.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    title="投稿を削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {postStats.length === 0 && (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">投稿がありません</h3>
          <p className="mt-1 text-sm text-gray-500">まだ投稿が作成されていません。</p>
        </div>
      )}
    </div>
  )
}

