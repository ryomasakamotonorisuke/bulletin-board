'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { BarChart3, Users, FileText, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  adminUsers: number
  totalPosts: number
  todayPosts: number
  thisWeekPosts: number
  postsPerUser: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    totalPosts: 0,
    todayPosts: 0,
    thisWeekPosts: 0,
    postsPerUser: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // ユーザー統計
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*')

      if (usersError) throw usersError

      const totalUsers = users?.length || 0
      const activeUsers = users?.filter(u => u.is_active).length || 0
      const adminUsers = users?.filter(u => u.is_admin).length || 0

      // 投稿統計
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('created_at')

      if (postsError) throw postsError

      const totalPosts = posts?.length || 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const todayPosts = posts?.filter(p => new Date(p.created_at) >= today).length || 0
      
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      const thisWeekPosts = posts?.filter(p => new Date(p.created_at) >= weekAgo).length || 0

      const postsPerUser = totalUsers > 0 ? (totalPosts / totalUsers).toFixed(1) : '0'

      setStats({
        totalUsers,
        activeUsers,
        adminUsers,
        totalPosts,
        todayPosts,
        thisWeekPosts,
        postsPerUser: parseFloat(postsPerUser),
      })
    } catch (error: any) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">統計を読み込み中...</span>
        </div>
      </div>
    )
  }

  const StatCard = ({ title, value, subtitle, icon: Icon, color }: {
    title: string
    value: string | number
    subtitle?: string
    icon: any
    color: string
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 japanese">{title}</p>
          <p className="text-3xl font-bold mt-2" style={{ color }}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1 japanese">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <BarChart3 className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900 japanese">ダッシュボード</h2>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="総ユーザー数"
          value={stats.totalUsers}
          subtitle={`アクティブ: ${stats.activeUsers}人`}
          icon={Users}
          color="#3B82F6"
        />
        <StatCard
          title="管理者"
          value={stats.adminUsers}
          icon={Users}
          color="#10B981"
        />
        <StatCard
          title="総投稿数"
          value={stats.totalPosts}
          subtitle={`平均 ${stats.postsPerUser}件/人`}
          icon={FileText}
          color="#8B5CF6"
        />
        <StatCard
          title="今週の投稿"
          value={stats.thisWeekPosts}
          subtitle={`今日: ${stats.todayPosts}件`}
          icon={TrendingUp}
          color="#F59E0B"
        />
      </div>

      {/* アクティビティ概要 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 japanese">アクティビティ概要</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 japanese">アクティブユーザー率</span>
            <span className="text-lg font-semibold" style={{ color: stats.activeUsers / stats.totalUsers > 0.8 ? '#10B981' : '#F59E0B' }}>
              {stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 japanese">管理者比率</span>
            <span className="text-lg font-semibold text-blue-600">
              {stats.totalUsers > 0 ? ((stats.adminUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 japanese">投稿者比率</span>
            <span className="text-lg font-semibold text-purple-600">
              {stats.totalPosts > 0 && stats.totalUsers > 0
                ? (((stats.totalPosts / stats.totalUsers) * 100) / 10).toFixed(1)
                : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

