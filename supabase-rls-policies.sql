-- Row Level Security (RLS) ポリシーの更新
-- 管理者がすべての投稿を編集・削除できるようにする

-- 投稿テーブルの既存ポリシーを削除
DROP POLICY IF EXISTS "Users can view all posts" ON posts;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts or admins can update all posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts or admins can delete all posts" ON posts;

-- 新しいポリシーを作成

-- 1. 全ユーザーが全投稿を閲覧可能
CREATE POLICY "Users can view all posts" 
  ON posts FOR SELECT 
  USING (true);

-- 2. 認証済みユーザーが投稿作成可能
CREATE POLICY "Authenticated users can create posts" 
  ON posts FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- 3. 所有者または管理者が投稿を更新可能
CREATE POLICY "Users can update own posts or admins can update all posts" 
  ON posts FOR UPDATE 
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- 4. 所有者または管理者が投稿を削除可能
CREATE POLICY "Users can delete own posts or admins can delete all posts" 
  ON posts FOR DELETE 
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- コメントテーブルも同様に更新

-- コメントの既存ポリシーを削除
DROP POLICY IF EXISTS "Users can view all comments" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
DROP POLICY IF EXISTS "Admins can delete all comments" ON comments;

-- 新しいコメントポリシーを作成（既存のものを削除）
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
CREATE POLICY "Users can view all comments" 
  ON comments FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create comments" 
  ON comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" 
  ON comments FOR UPDATE 
  USING (auth.uid() = user_id);

-- 所有者または管理者がコメントを削除可能（既存のものを削除）
DROP POLICY IF EXISTS "Users can delete own comments or admins can delete all comments" ON comments;
CREATE POLICY "Users can delete own comments or admins can delete all comments" 
  ON comments FOR DELETE 
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

