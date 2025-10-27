-- このSQLをSupabaseのSQL Editorで実行してください

-- postsテーブルにpost_typeカラムを追加
ALTER TABLE posts ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'user';

-- 既存の投稿にpost_type='user'を設定
UPDATE posts SET post_type = 'user' WHERE post_type IS NULL OR post_type = '';

-- 確認
SELECT id, title, post_type FROM posts LIMIT 5;

