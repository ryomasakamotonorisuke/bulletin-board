-- ユーザーID認証システムへの移行
-- SupabaseのSQL Editorで実行してください

-- 1. profilesテーブルにuser_idカラムを追加（既存のemailの代わり）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;

-- 2. 既存データの移行（emailの値をuser_idにコピー）
UPDATE profiles 
SET user_id = email 
WHERE user_id IS NULL AND email IS NOT NULL;

-- 3. user_idのインデックスを作成
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);

-- 4. is_activeのインデックスを作成
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);

-- 5. 既存のユーザーをアクティブに設定
UPDATE profiles SET is_active = TRUE WHERE is_active IS NULL;

-- 6. パスワード変更フラグをfalseに設定（初回変更を強制）
UPDATE profiles SET password_changed = FALSE WHERE password_changed IS NULL;

-- 7. 管理者権限のあるユーザーを確認
SELECT id, user_id, full_name, is_admin, is_active, password_changed 
FROM profiles 
WHERE is_admin = TRUE;

