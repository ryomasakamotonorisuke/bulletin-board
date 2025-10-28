-- データベース整理: 既存データを削除（管理者ユーザーは残す）

-- ⚠️ このスクリプトを実行する前に、管理者ユーザーのIDを確認してください

-- 1. 管理者ユーザーの確認
SELECT id, email, full_name, is_admin, created_at 
FROM profiles 
WHERE is_admin = true
ORDER BY created_at;

-- 上記の結果をメモしてください（管理者のID、メールアドレスなど）

-- 2. 投稿関連のデータを削除
DELETE FROM comments;
DELETE FROM likes;
DELETE FROM posts;

-- 3. 管理者以外のプロフィールを削除
DELETE FROM profiles WHERE is_admin = false;

-- 4. 新しいカラムを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;

-- 5. 管理者ユーザーにuser_idを設定（emailを使用）
UPDATE profiles 
SET user_id = email 
WHERE user_id IS NULL AND email IS NOT NULL;

-- 6. デフォルト値を設定
UPDATE profiles SET is_active = TRUE WHERE is_active IS NULL;
UPDATE profiles SET password_changed = FALSE WHERE password_changed IS NULL;

-- 7. インデックス作成
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);
CREATE INDEX IF NOT EXISTS profiles_password_changed_idx ON profiles(password_changed);

-- 8. 結果を確認
SELECT 
  id, 
  email, 
  full_name, 
  user_id,
  is_admin, 
  is_active, 
  password_changed,
  employee_id,
  department,
  created_at 
FROM profiles
ORDER BY created_at;

