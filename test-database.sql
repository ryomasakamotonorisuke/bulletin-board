-- データベース接続テスト用SQL
-- SupabaseのSQL Editorで実行してください

-- 1. テーブル存在確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'posts');

-- 2. プロフィールテーブルの内容確認
SELECT * FROM profiles LIMIT 5;

-- 3. 投稿テーブルの内容確認
SELECT * FROM posts LIMIT 5;

-- 4. RLSポリシー確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'posts');

-- 5. テスト投稿を手動で挿入
INSERT INTO posts (user_id, title, content) 
VALUES (
  (SELECT id FROM profiles LIMIT 1), 
  'テスト投稿', 
  'これはテスト投稿です'
) 
ON CONFLICT DO NOTHING;

-- 6. 挿入後の投稿確認
SELECT * FROM posts ORDER BY created_at DESC LIMIT 5;


