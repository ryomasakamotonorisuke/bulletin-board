-- Supabaseで以下を実行してください

-- 1. postsテーブルにpost_typeカラムを追加
ALTER TABLE posts ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'user';

-- 2. profilesテーブルにroleカラムを追加（まだの場合）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'viewer';

-- 3. 既存のpost_typeがNULLの投稿を'user'に設定
UPDATE posts 
SET post_type = 'user' 
WHERE post_type IS NULL;

-- 4. インデックスを作成
CREATE INDEX IF NOT EXISTS posts_post_type_idx ON posts(post_type);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- 確認クエリ
SELECT post_type, COUNT(*) FROM posts GROUP BY post_type;
SELECT role, COUNT(*) FROM profiles GROUP BY role;



