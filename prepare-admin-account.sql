-- 管理者アカウントの準備とデータベースセットアップ
-- このファイルをSupabase SQL Editorで実行してください

-- ==========================================
-- ステップ1: 現在の状態を確認
-- ==========================================

-- 既存の管理者を確認
SELECT 
  p.id as profile_id,
  u.id as user_id,
  u.email,
  u.created_at as user_created,
  p.full_name,
  p.username,
  p.is_admin,
  p.is_employee
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true OR u.email LIKE '%admin%'
ORDER BY u.created_at;

-- ==========================================
-- ステップ2: 管理者アカウントが存在しない場合、作成
-- ==========================================

-- これは後で手動で作成してください
-- Supabaseダッシュボード → Authentication → Add user
-- または、プロジェクトルートの create-admin-user.js を実行

-- ==========================================
-- ステップ3: 新しいカラムを追加
-- ==========================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;

-- ==========================================
-- ステップ4: user_idを設定（auth.usersからemailを取得）
-- ==========================================

UPDATE profiles p
SET user_id = u.email
FROM auth.users u
WHERE p.id = u.id 
  AND (p.user_id IS NULL OR p.user_id = '')
  AND u.email IS NOT NULL;

-- ==========================================
-- ステップ5: 管理者をアクティブにして、初回変更フラグをセット
-- ==========================================

UPDATE profiles 
SET 
  is_active = TRUE,
  password_changed = FALSE,  -- 初回ログイン時にパスワード変更を強制
  is_admin = TRUE            -- 確実に管理者として設定
WHERE is_admin = true;

-- ==========================================
-- ステップ6: デフォルト値を設定
-- ==========================================

UPDATE profiles SET is_active = TRUE WHERE is_active IS NULL;
UPDATE profiles SET password_changed = FALSE WHERE password_changed IS NULL;

-- ==========================================
-- ステップ7: インデックス作成
-- ==========================================

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);
CREATE INDEX IF NOT EXISTS profiles_password_changed_idx ON profiles(password_changed);
CREATE INDEX IF NOT EXISTS profiles_is_admin_idx ON profiles(is_admin);

-- ==========================================
-- ステップ8: 管理者ユーザーを確認
-- ==========================================

SELECT 
  '✅ 管理者アカウント情報' as status,
  u.email as ログインメールアドレス,
  p.full_name as 氏名,
  p.username as ユーザー名,
  p.is_admin as 管理者権限,
  p.is_active as アクティブ,
  CASE 
    WHEN p.password_changed = FALSE THEN '⚠️ 初回ログイン時にパスワード変更が必要'
    ELSE '✅ パスワード変更済み'
  END as パスワード状態
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true
ORDER BY u.created_at;

-- ==========================================
-- ステップ9: 管理者以外のデータを削除（オプション）
-- ==========================================

-- ⚠️ 管理者以外のユーザーを削除する場合はコメントを外してください
-- DELETE FROM profiles WHERE is_admin = false;

-- 投稿データを削除
-- DELETE FROM comments;
-- DELETE FROM likes;
-- DELETE FROM posts;

-- ==========================================
-- 完了
-- ==========================================

SELECT '✅ データベースセットアップ完了！' as status,
       '次はデプロイされたサイトでログインしてください。' as next_step;

