-- クイックセットアップ: データベースと管理者アカウントを準備

-- ステップ1: 既存のユーザーを確認
SELECT 
  u.email,
  p.full_name,
  p.is_admin,
  p.is_active,
  u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- ステップ2: profilesテーブルに新しいカラムを追加（存在しない場合）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;

-- ステップ3: 管理者ユーザーを設定
-- 既存のユーザーを管理者にする場合（最初のユーザー）
UPDATE profiles 
SET 
  is_admin = TRUE,
  is_active = TRUE,
  is_employee = TRUE,
  user_id = (
    SELECT email FROM auth.users WHERE auth.users.id = profiles.id
  )
WHERE id IN (
  SELECT id FROM auth.users ORDER BY created_at LIMIT 1
);

-- ステップ4: user_idを設定（全てのユーザー）
UPDATE profiles p
SET user_id = u.email
FROM auth.users u
WHERE p.id = u.id 
  AND (p.user_id IS NULL OR p.user_id = '')
  AND u.email IS NOT NULL;

-- ステップ5: デフォルト値を設定
UPDATE profiles SET is_active = TRUE WHERE is_active IS NULL;
UPDATE profiles SET password_changed = FALSE WHERE password_changed IS NULL;

-- ステップ6: インデックス作成
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);
CREATE INDEX IF NOT EXISTS profiles_password_changed_idx ON profiles(password_changed);

-- ステップ7: 結果を確認
SELECT 
  u.email as ログインメールアドレス,
  p.full_name as 氏名,
  p.is_admin as 管理者,
  p.is_active as アクティブ,
  u.created_at as 作成日時
FROM profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.is_admin DESC, u.created_at DESC;

