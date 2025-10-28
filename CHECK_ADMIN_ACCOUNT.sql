-- 管理者アカウントを確認するSQL

-- 1. 現在の管理者を確認
SELECT 
  '管理者アカウント情報' as status,
  u.email as ログインメールアドレス,
  p.full_name as 氏名,
  p.username as ユーザー名,
  p.is_admin as 管理者権限,
  p.is_active as アクティブ,
  CASE 
    WHEN p.password_changed = FALSE THEN '初回ログイン時にパスワード変更が必要'
    ELSE 'パスワード変更済み'
  END as パスワード状態,
  u.created_at as 作成日時
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true
ORDER BY u.created_at;

-- 2. 全てのユーザーを確認（管理者含む）
SELECT 
  u.email as メールアドレス,
  p.full_name as 氏名,
  p.is_admin as 管理者,
  p.is_active as アクティブ
FROM profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY u.created_at;

