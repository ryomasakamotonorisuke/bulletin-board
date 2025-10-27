-- ストレージポリシーを修正するSQL
-- SupabaseのSQL Editorで実行してください

-- 1. 既存のストレージポリシーを削除
DROP POLICY IF EXISTS "Users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- 2. 新しいストレージポリシーを作成（修正版）
-- 画像のアップロードを許可（認証済みユーザー）
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'post-images' 
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 画像の表示を許可（すべてのユーザー）
CREATE POLICY "Images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'post-images');

-- 画像の削除を許可（認証済みユーザー）
CREATE POLICY "Authenticated users can delete own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'post-images' 
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. 投稿テーブルのRLSポリシーも確認・修正
-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view all posts" ON posts;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;

-- 新しい投稿ポリシーを作成
CREATE POLICY "Authenticated users can view all posts" ON posts
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create posts" ON posts
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' 
  AND auth.uid() = user_id
);

CREATE POLICY "Authenticated users can update own posts" ON posts
FOR UPDATE USING (
  auth.role() = 'authenticated' 
  AND auth.uid() = user_id
);

CREATE POLICY "Authenticated users can delete own posts" ON posts
FOR DELETE USING (
  auth.role() = 'authenticated' 
  AND auth.uid() = user_id
);

-- 4. プロフィールテーブルのRLSポリシーも確認・修正
-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 新しいプロフィールポリシーを作成
CREATE POLICY "Authenticated users can view all profiles" ON profiles
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update own profile" ON profiles
FOR UPDATE USING (
  auth.role() = 'authenticated' 
  AND auth.uid() = id
);

CREATE POLICY "Authenticated users can insert own profile" ON profiles
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' 
  AND auth.uid() = id
);
