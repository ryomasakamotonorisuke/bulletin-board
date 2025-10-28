-- 最終的なデータベースセットアップ
-- このファイルをSupabase SQL Editorで実行してください

-- ==========================================
-- ステップ1: 管理者ユーザーを確認
-- ==========================================
SELECT 
  p.id,
  u.email,
  u.raw_user_meta_data,
  p.full_name,
  p.username,
  p.is_admin,
  p.is_employee
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true OR u.email = 'admin@admin.com';

-- ==========================================
-- ステップ2: 新しいカラムを追加（存在しない場合のみ）
-- ==========================================

-- user_idカラム
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN user_id TEXT;
  END IF;
END $$;

-- is_activeカラム
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- password_changedカラム
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'password_changed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN password_changed BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- employee_idカラム
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'employee_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN employee_id TEXT;
  END IF;
END $$;

-- departmentカラム
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'department'
  ) THEN
    ALTER TABLE profiles ADD COLUMN department TEXT;
  END IF;
END $$;

-- ==========================================
-- ステップ3: user_idを設定
-- ==========================================

-- auth.usersからemailを取得してuser_idに設定
UPDATE profiles p
SET user_id = u.email
FROM auth.users u
WHERE p.id = u.id 
  AND (p.user_id IS NULL OR p.user_id = '')
  AND u.email IS NOT NULL;

-- ==========================================
-- ステップ4: デフォルト値を設定
-- ==========================================

UPDATE profiles SET is_active = TRUE WHERE is_active IS NULL;
UPDATE profiles SET password_changed = FALSE WHERE password_changed IS NULL;

-- ==========================================
-- ステップ5: インデックス作成
-- ==========================================

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id) 
WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);
CREATE INDEX IF NOT EXISTS profiles_password_changed_idx ON profiles(password_changed);

-- ==========================================
-- ステップ6: 結果を確認
-- ==========================================

SELECT 
  p.id,
  u.email,
  p.user_id,
  p.full_name,
  p.username,
  p.is_admin,
  p.is_employee,
  p.is_active,
  p.password_changed,
  p.employee_id,
  p.department,
  u.created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC;

-- ==========================================
-- ステップ7: 管理者ユーザーを確認
-- ==========================================

SELECT 
  '管理者ユーザー情報' as status,
  p.id,
  u.email as login_email,
  p.user_id,
  p.full_name,
  p.is_admin,
  p.is_active,
  p.password_changed,
  CASE 
    WHEN p.password_changed = FALSE THEN '初回ログイン時にパスワード変更が必要'
    ELSE 'パスワードは既に変更済み'
  END as password_status
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true;

