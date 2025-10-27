-- Supabaseで以下を実行してください

-- 1. image_urlsカラムを追加
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- 2. 既存データの移行（image_urlがNULLでない場合）
UPDATE posts 
SET image_urls = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND (image_urls IS NULL OR array_length(image_urls, 1) IS NULL);

-- 3. インデックスの作成
CREATE INDEX IF NOT EXISTS posts_image_urls_idx ON posts USING GIN(image_urls);

-- 確認
SELECT id, title, image_url, image_urls FROM posts LIMIT 3;


