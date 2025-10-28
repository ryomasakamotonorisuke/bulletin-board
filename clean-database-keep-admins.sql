-- データベース整理: 既存データを削除（管理者ユーザーは残す）

-- 1. 管理者ユーザーのIDを保存
-- まず以下を実行して管理者のIDを確認:
-- SELECT id, email, full_name FROM profiles WHERE is_admin = true;

-- 2. 管理者ユーザーのプロフィールをバックアップ
-- CREATE TABLE IF NOT EXISTS admin_backup AS 
-- SELECT * FROM profiles WHERE is_admin = true;

-- 3. 投稿データを削除（管理者の投稿も含む）
DELETE FROM comments;
DELETE FROM likes;
DELETE FROM posts;

-- 4. 管理者以外のプロフィールを削除
DELETE FROM profiles WHERE is_admin = false;

-- 5. 管理者ユーザーのプロフィールを復元（必要に応じて）
-- INSERT INTO profiles SELECT * FROM admin_backup;
-- DROP TABLE admin_backup;

-- 6. 新しいカラムを追加（存在しない場合）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;

-- 7. 既存の管理者にuser_idを設定（emailを使用）
UPDATE profiles 
SET user_id = email 
WHERE user_id IS NULL AND email IS NOT NULL;

-- 8. デフォルト値を設定
UPDATE profiles SET is_active = TRUE WHERE is_active IS NULL;
UPDATE profiles SET password_changed = FALSE WHERE password_changed IS NULL;

-- 9. インデックス作成
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);

-- 10. 結果を確認
SELECT id, email, full_name, is_admin, is_active, password_changed FROM profiles;

