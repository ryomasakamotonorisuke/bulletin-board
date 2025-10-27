-- 管理者機能用のデータベーススキーマ更新

-- プロフィールテーブルに管理者フラグを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 管理者ユーザーを作成する関数
CREATE OR REPLACE FUNCTION create_admin_user(
  email TEXT,
  password TEXT,
  full_name TEXT,
  username TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  new_user_id UUID;
  result JSON;
BEGIN
  -- ユーザーを作成
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    last_sign_in_at,
    email_change,
    email_change_sent_at,
    confirmation_token,
    email_change_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    email,
    crypt(password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    json_build_object('full_name', full_name),
    false,
    NOW(),
    '',
    NULL,
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- プロフィールを作成（管理者として）
  INSERT INTO profiles (id, username, full_name, is_admin, created_at, updated_at)
  VALUES (new_user_id, username, full_name, TRUE, NOW(), NOW());

  -- 結果を返す
  result := json_build_object(
    'success', true,
    'user_id', new_user_id,
    'email', email,
    'message', '管理者ユーザーが作成されました'
  );

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    result := json_build_object(
      'success', false,
      'error', SQLERRM,
      'message', '管理者ユーザーの作成に失敗しました'
    );
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 管理者権限チェック関数
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM profiles 
    WHERE id = user_id AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 管理者のみがアクセス可能なポリシー
CREATE POLICY "Only admins can view all profiles" 
  ON profiles FOR SELECT 
  USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can update profiles" 
  ON profiles FOR UPDATE 
  USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete profiles" 
  ON profiles FOR DELETE 
  USING (is_admin(auth.uid()));

-- 管理者はすべての投稿を削除可能
CREATE POLICY "Admins can delete any posts" 
  ON posts FOR DELETE 
  USING (is_admin(auth.uid()));

-- 管理者はすべての投稿を更新可能
CREATE POLICY "Admins can update any posts" 
  ON posts FOR UPDATE 
  USING (is_admin(auth.uid()));

-- 管理者用のビュー
CREATE OR REPLACE VIEW admin_users AS
SELECT 
  p.id,
  p.username,
  p.full_name,
  p.avatar_url,
  p.is_admin,
  p.created_at,
  p.updated_at,
  au.email,
  au.last_sign_in_at,
  au.email_confirmed_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.is_admin = TRUE;

-- 管理者用の投稿統計ビュー
CREATE OR REPLACE VIEW admin_post_stats AS
SELECT 
  p.id,
  p.title,
  p.created_at,
  p.updated_at,
  pr.username,
  pr.full_name,
  pr.is_admin,
  CASE 
    WHEN p.image_url IS NOT NULL THEN '画像付き'
    ELSE 'テキストのみ'
  END as post_type
FROM posts p
JOIN profiles pr ON p.user_id = pr.id
ORDER BY p.created_at DESC;

