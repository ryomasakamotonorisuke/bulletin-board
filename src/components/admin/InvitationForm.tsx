'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Mail, Plus, X } from 'lucide-react'

export default function InvitationForm() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [department, setDepartment] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [invitations, setInvitations] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage(null)

    // 招待トークンを生成
    const token = `${Date.now()}-${Math.random().toString(36).substring(7)}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7日間有効

    const { error } = await supabase
      .from('invitations')
      .insert({
        email,
        full_name: fullName || null,
        employee_id: employeeId || null,
        department: department || null,
        invited_by: user.id,
        token,
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      })

    if (error) {
      setMessage({ type: 'error', text: '招待の送信に失敗しました: ' + error.message })
    } else {
      setMessage({ type: 'success', text: '招待を送信しました' })
      setEmail('')
      setFullName('')
      setEmployeeId('')
      setDepartment('')
      fetchInvitations()
    }

    setLoading(false)
  }

  const fetchInvitations = async () => {
    const { data } = await supabase
      .from('invitations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) {
      setInvitations(data)
    }
  }

  const deleteInvitation = async (id: string) => {
    if (!confirm('この招待を削除しますか？')) return

    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchInvitations()
    }
  }

  // 初回読み込み時に招待一覧を取得
  if (invitations.length === 0) {
    fetchInvitations()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">ユーザー招待</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス *
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            氏名
          </label>
          <input
            id="fullName"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="山田 太郎"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
              社員ID
            </label>
            <input
              id="employeeId"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="EMP001"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              部署
            </label>
            <input
              id="department"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="営業部"
            />
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {loading ? '送信中...' : '招待を送信'}
        </button>
      </form>

      {/* 招待履歴 */}
      {invitations.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近の招待</h3>
          <div className="space-y-2">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{invitation.email}</div>
                  <div className="text-sm text-gray-600">
                    {invitation.full_name && `${invitation.full_name} `}
                    ({invitation.department || '部署未設定'})
                  </div>
                  <div className="text-xs text-gray-500">
                    ステータス: {invitation.status === 'pending' ? '未承認' : invitation.status === 'accepted' ? '承認済み' : '拒否'}
                  </div>
                </div>
                <button
                  onClick={() => deleteInvitation(invitation.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="削除"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

