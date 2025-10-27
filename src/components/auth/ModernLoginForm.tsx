'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'

interface ModernLoginFormProps {
  onForgotPassword?: () => void
  onSignUp?: () => void
}

export default function ModernLoginForm({ onForgotPassword, onSignUp }: ModernLoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await signIn(email, password)
    
    if (signInError) {
      setError(signInError.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#011623' }}>
      {/* 左側: 画像 */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-12 relative overflow-hidden">
        {/* アニメーション背景 */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: '#FFC700' }}
          />
          <div 
            className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: '#F69111' }}
          />
        </div>
        
        {/* コンテンツ */}
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(255, 199, 0, 0.2)', backdropFilter: 'blur(20px)' }}>
              <Sparkles className="w-16 h-16" style={{ color: '#FFC700' }} />
            </div>
            <h2 className="text-5xl font-bold mb-4 text-white">
              社内掲示板
            </h2>
            <p className="text-xl text-gray-300">
              チームの情報をシェアしよう
            </p>
          </div>
          
          {/* 特徴 */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <div className="mt-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FFC700' }} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 japanese">リアルタイム更新</h3>
                <p className="text-sm text-gray-400 japanese">最新の投稿を即座に確認</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <div className="mt-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#E53647' }} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 japanese">写真共有</h3>
                <p className="text-sm text-gray-400 japanese">複数画像を添付可能</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <div className="mt-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#BBCF00' }} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 japanese">交流機能</h3>
                <p className="text-sm text-gray-400 japanese">いいねとコメントでつながる</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右側: フォーム */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div 
          className="w-full max-w-md p-8 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(250, 253, 255, 0.95) 0%, rgba(250, 253, 255, 0.9) 100%)',
            backdropFilter: 'blur(40px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 199, 0, 0.2)',
            border: '2px solid rgba(255, 199, 0, 0.3)'
          }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
              style={{ backgroundColor: '#FFC700' }}>
              <Mail className="w-10 h-10" style={{ color: '#011623' }} />
            </div>
            <h2 className="text-3xl font-bold mb-2 japanese" style={{ color: '#011623' }}>
              ログイン
            </h2>
            <p className="text-gray-600 japanese">
              アカウントにアクセスして開始
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(229, 54, 71, 0.1)' }}>
              <p className="text-sm text-red-600 japanese">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メール */}
            <div>
              <label className="block text-sm font-bold mb-2 japanese" style={{ color: '#011623' }}>
                メールアドレス
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" style={{ color: '#F69111' }} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-yellow transition-all"
                  style={{
                    borderColor: '#FFC700',
                    backgroundColor: 'rgba(250, 253, 255, 0.8)'
                  }}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-sm font-bold mb-2 japanese" style={{ color: '#011623' }}>
                パスワード
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: '#F69111' }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-yellow transition-all"
                  style={{
                    borderColor: '#FFC700',
                    backgroundColor: 'rgba(250, 253, 255, 0.8)'
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" style={{ color: '#F69111' }} />
                  ) : (
                    <Eye className="h-5 w-5" style={{ color: '#F69111' }} />
                  )}
                </button>
              </div>
            </div>

            {/* パスワード忘れ */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm font-bold hover:underline japanese"
                style={{ color: '#F69111' }}
              >
                パスワードをお忘れですか？
              </button>
            </div>

            {/* ログインボタン */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed japanese"
              style={{
                background: 'linear-gradient(135deg, #FFC700 0%, #F69111 100%)',
                color: '#011623',
                boxShadow: '0 8px 20px rgba(255, 199, 0, 0.3)'
              }}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          {/* 新規登録 */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-3 japanese">
              アカウントをお持ちでないですか？
            </p>
            <button
              onClick={onSignUp}
              className="w-full py-3 rounded-2xl font-bold border-2 transition-all hover:scale-105 japanese"
              style={{
                borderColor: '#FFC700',
                color: '#011623',
                backgroundColor: 'transparent'
              }}
            >
              新規登録
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


