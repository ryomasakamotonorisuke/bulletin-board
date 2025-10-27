-- テスト用: post_typeなしで投稿が作成できるか確認するSQL

-- まず、カラムが存在するか確認
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'posts' AND column_name IN ('post_type', 'image_urls');

-- postsテーブルの構造を確認
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'posts'
ORDER BY ordinal_position;



