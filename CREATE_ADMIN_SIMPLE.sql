-- 管理者アカウントを簡単に作成するSQL（修正版）
-- Supabase SQL Editorで実行してください

-- ステップ1: emailでprofilesを更新（推奨）
-- ⚠️ 事前にSupabaseダッシュボードで admin@admin.com のユーザーを作成してください

UPDATE profiles p
SET 
  is_admin = TRUE,
  is_active = TRUE,
  password_changed = FALSE,
  full_name = '管理者',
  username = 'admin',
  user_id = 'admin@admin.com'
WHERE p.id IN (
  SELECT id FROM auth.users WHERE email = 'admin@admin.com'
);

-- ステップ2: 確認
SELECT 
  u.email as メールアドレス,
  p.full_name as 氏名,
  p.is_admin as 管理者,
  p.is_active as アクティブ
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true;

