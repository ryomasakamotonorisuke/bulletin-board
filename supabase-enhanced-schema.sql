-- エンハンスド掲示板アプリケーション用のデータベーススキーマ
-- 既存のスキーマを拡張

-- 0. 更新日時の自動更新関数を作成（存在しない場合）
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. profilesテーブルの拡張（既存テーブルにis_adminとis_employeeカラムを追加）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_employee BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;

-- 2. いいねテーブル
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- いいね用のインデックス
CREATE INDEX IF NOT EXISTS likes_post_id_idx ON likes(post_id);
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON likes(user_id);

-- 3. コメントテーブル
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- コメント用のインデックス
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON comments(user_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at DESC);

-- 4. ユーザー招待テーブル（管理者による招待管理）
CREATE TABLE IF NOT EXISTS invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  employee_id TEXT,
  department TEXT,
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- 招待用のインデックス
CREATE INDEX IF NOT EXISTS invitations_email_idx ON invitations(email);
CREATE INDEX IF NOT EXISTS invitations_token_idx ON invitations(token);
CREATE INDEX IF NOT EXISTS invitations_status_idx ON invitations(status);

-- Row Level Security (RLS) の有効化
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- いいね関連のポリシー（既存のものを削除してから作成）
DROP POLICY IF EXISTS "Users can view all likes" ON likes;
CREATE POLICY "Users can view all likes" 
  ON likes FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can create likes" ON likes;
CREATE POLICY "Users can create likes" 
  ON likes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own likes" ON likes;
CREATE POLICY "Users can delete own likes" 
  ON likes FOR DELETE 
  USING (auth.uid() = user_id);

-- コメント関連のポリシー（既存のものを削除してから作成）
DROP POLICY IF EXISTS "Users can view all comments" ON comments;
CREATE POLICY "Users can view all comments" 
  ON comments FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON comments;
CREATE POLICY "Users can create comments" 
  ON comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON comments;
CREATE POLICY "Users can update own comments" 
  ON comments FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments" 
  ON comments FOR DELETE 
  USING (auth.uid() = user_id);

-- 管理者はすべてのコメントを削除可能
DROP POLICY IF EXISTS "Admins can delete all comments" ON comments;
CREATE POLICY "Admins can delete all comments" 
  ON comments FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- 招待関連のポリシー（既存のものを削除してから作成）
DROP POLICY IF EXISTS "Authenticated users can view invitations" ON invitations;
CREATE POLICY "Authenticated users can view invitations" 
  ON invitations FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can create invitations" ON invitations;
CREATE POLICY "Admins can create invitations" 
  ON invitations FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

DROP POLICY IF EXISTS "Admins can update invitations" ON invitations;
CREATE POLICY "Admins can update invitations" 
  ON invitations FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

DROP POLICY IF EXISTS "Admins can delete invitations" ON invitations;
CREATE POLICY "Admins can delete invitations" 
  ON invitations FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- コメントの更新日時自動更新トリガー（存在しない場合のみ作成）
DROP TRIGGER IF EXISTS handle_updated_at_comments ON comments;
CREATE TRIGGER handle_updated_at_comments
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 投稿のいいね数とコメント数を計算するビュー
CREATE OR REPLACE VIEW post_stats AS
SELECT 
  p.id AS post_id,
  COUNT(DISTINCT l.id) AS like_count,
  COUNT(DISTINCT c.id) AS comment_count,
  MAX(c.created_at) AS last_comment_at
FROM posts p
LEFT JOIN likes l ON p.id = l.post_id
LEFT JOIN comments c ON p.id = c.post_id
GROUP BY p.id;

