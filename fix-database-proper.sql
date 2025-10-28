-- データベース整理: 正しいアプローチ

-- ステップ1: profilesテーブルの構造を確認
-- まずこれを実行して結果を確認：
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ステップ2: 既存のデータ確認
SELECT p.*, u.email as auth_email
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC;

-- ステップ3: 投稿関連のデータを削除
DELETE FROM comments;
DELETE FROM likes;
DELETE FROM posts;

-- ステップ4: 管理者以外のユーザーを削除
-- ⚠️ まず管理者のIDを確認してください
SELECT id, username, full_name FROM profiles WHERE is_admin = true;

-- 管理者のIDを確認したら、以下を実行
-- DELETE FROM profiles WHERE is_admin = false;

-- ステップ5: 新しいカラムを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;

-- ステップ6: auth.usersからemailを取得して設定
UPDATE profiles p
SET user_id = u.email
FROM auth.users u
WHERE p.id = u.id 
  AND p.user_id IS NULL 
  AND u.email IS NOT NULL;

-- ステップ7: デフォルト値を設定
UPDATE profiles SET is_active = TRUE WHERE is_active IS NULL;
UPDATE profiles SET password_changed = FALSE WHERE password_changed IS NULL;

-- ステップ8: インデックス作成
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);
CREATE INDEX IF NOT EXISTS profiles_password_changed_idx ON profiles(password_changed);

-- ステップ9: 結果を確認
SELECT 
  p.id,
  u.email as auth_email,
  p.user_id,
  p.full_name,
  p.username,
  p.is_admin,
  p.is_active,
  p.password_changed
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at;

