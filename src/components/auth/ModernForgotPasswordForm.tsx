'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

interface ModernForgotPasswordFormProps {
  onBack: () => void
}

export default function ModernForgotPasswordForm({ onBack }: ModernForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccess(true)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#011623' }}>
      <div 
        className="w-full max-w-md p-8 rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(250, 253, 255, 0.95) 0%, rgba(250, 253, 255, 0.9) 100%)',
          backdropFilter: 'blur(40px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 199, 0, 0.2)',
          border: '2px solid rgba(255, 199, 0, 0.3)'
        }}
      >
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold japanese">戻る</span>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
            style={{ backgroundColor: '#FFC700' }}>
            <Mail className="w-10 h-10" style={{ color: '#011623' }} />
          </div>
          <h2 className="text-3xl font-bold mb-2 japanese" style={{ color: '#011623' }}>
            パスワードをリセット
          </h2>
          <p className="text-gray-600 japanese">
            登録済みのメールアドレスを入力してください
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: 'rgba(187, 207, 0, 0.2)' }}>
              <CheckCircle className="w-10 h-10" style={{ color: '#BBCF00' }} />
            </div>
            <h3 className="text-xl font-bold mb-3 japanese" style={{ color: '#011623' }}>
              メールを送信しました
            </h3>
            <p className="text-gray-600 mb-6 japanese">
              {email} にパスワードリセットリンクを送信しました。<br />
              メール内のリンクをクリックしてパスワードをリセットしてください。
            </p>
            <button
              onClick={onBack}
              className="w-full py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 japanese"
              style={{
                background: 'linear-gradient(135deg, #FFC700 0%, #F69111 100%)',
                color: '#011623',
                boxShadow: '0 8px 20px rgba(255, 199, 0, 0.3)'
              }}
            >
              ログインに戻る
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(229, 54, 71, 0.1)' }}>
                <p className="text-sm text-red-600 japanese">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                {loading ? '送信中...' : 'リセットメールを送信'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}



