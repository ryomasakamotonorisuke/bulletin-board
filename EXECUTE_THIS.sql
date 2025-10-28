-- ⚠️ このファイルをSupabase SQL Editorで実行してください

-- ステップ1: 現在の構造を確認
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ステップ2: 管理者を確認
SELECT p.id, u.email, p.full_name, p.is_admin
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true;

-- ⚠️ 上記の結果を見て、管理者のIDとメールアドレスをメモしてください

-- ステップ3: データを削除（管理者以外）
-- ⚠️ 管理者のIDを確認してから、該当するIDを除外して削除
-- DELETE FROM profiles WHERE is_admin = false;

-- 投稿データを削除
DELETE FROM comments;
DELETE FROM likes;
DELETE FROM posts;

-- ステップ4: 新しいカラムを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;

-- ステップ5: auth.usersからemailを取得してuser_idに設定
UPDATE profiles p
SET user_id = u.email
FROM auth.users u
WHERE p.id = u.id 
  AND p.user_id IS NULL 
  AND u.email IS NOT NULL;

-- ステップ6: デフォルト値を設定
UPDATE profiles SET is_active = TRUE WHERE is_active IS NULL;
UPDATE profiles SET password_changed = FALSE WHERE password_changed IS NULL;

-- ステップ7: インデックス作成
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);
CREATE INDEX IF NOT EXISTS profiles_password_changed_idx ON profiles(password_changed);

-- ステップ8: 結果を確認
SELECT 
  p.id,
  u.email as auth_email,
  p.user_id,
  p.full_name,
  p.username,
  p.is_admin,
  p.is_active,
  p.password_changed,
  p.employee_id,
  p.department
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at;

