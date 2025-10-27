-- ユーザーロール・権限システムの追加

-- 1. profilesテーブルにroleカラムを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'viewer';

-- roleの可能な値:
-- 'admin' - 管理者ユーザー
-- 'poster' - 投稿者ユーザー  
-- 'viewer' - 閲覧者ユーザー
-- 'store' - 店舗アカウント

-- 2. postsテーブルにpost_typeカラムを追加
ALTER TABLE posts ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'user';

-- post_typeの可能な値:
-- 'user' - ユーザー投稿
-- 'store' - 店舗投稿

-- 3. 既存データの移行（is_adminフラグをroleに変換）
UPDATE profiles 
SET role = CASE 
  WHEN is_admin = TRUE THEN 'admin'
  ELSE 'viewer'
END
WHERE role = 'viewer' OR role IS NULL;

-- 4. 社員フラグも確認
UPDATE profiles 
SET role = 'poster'
WHERE is_employee = TRUE AND role = 'viewer' AND is_admin = FALSE;

-- 5. インデックスの作成
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS posts_post_type_idx ON posts(post_type);

