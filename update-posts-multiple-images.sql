-- postsテーブルに複数画像対応のカラムを追加

-- image_urlカラムを配列型に変更
ALTER TABLE posts DROP COLUMN IF EXISTS image_urls;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';

-- 既存のimage_urlのデータをimage_urlsに移行
UPDATE posts 
SET image_urls = CASE 
  WHEN image_url IS NOT NULL THEN ARRAY[image_url] 
  ELSE '{}' 
END
WHERE image_urls IS NULL OR array_length(image_urls, 1) IS NULL;

-- 既存のimage_urlカラムは保持（後方互換性のため）
-- 将来削除する場合は以下を実行:
-- ALTER TABLE posts DROP COLUMN IF EXISTS image_url;

