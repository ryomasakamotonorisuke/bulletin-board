// 管理者アカウント作成スクリプト
// Node.jsで実行: node create-admin-user.js

const { createClient } = require('@supabase/supabase-js')

// 環境変数から設定を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://phbizanrnmjqtiybagzw.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQwODUwMSwiZXhwIjoyMDc2OTg0NTAxfQ.x2MEHyHFBDWFlZe-LmF7xOlEntmT8O7gfxSJjAbkpus'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    console.log('管理者アカウントを作成中...')
    
    // 1. 認証ユーザーを作成
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@admin.com',
      password: 'admin',
      email_confirm: true,
      user_metadata: {
        full_name: '管理者'
      }
    })

    if (authError) {
      console.error('認証ユーザー作成エラー:', authError)
      return
    }

    console.log('認証ユーザー作成成功:', authData.user.id)

    // 2. プロフィールを作成
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: 'admin',
        full_name: '管理者',
        is_admin: true
      })
      .select()

    if (profileError) {
      console.error('プロフィール作成エラー:', profileError)
      return
    }

    console.log('プロフィール作成成功:', profileData)

    console.log('✅ 管理者アカウントが正常に作成されました！')
    console.log('📧 メールアドレス: admin@admin.com')
    console.log('🔑 パスワード: admin')
    console.log('👤 ユーザー名: admin')
    console.log('🛡️ 管理者権限: 有効')

  } catch (error) {
    console.error('予期しないエラー:', error)
  }
}

createAdminUser()


