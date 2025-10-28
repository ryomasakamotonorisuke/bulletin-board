-- profilesテーブルの構造を確認

-- 1. テーブルの構造を確認
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. 既存のデータを確認
SELECT * FROM profiles LIMIT 5;

-- 3. auth.usersテーブルと結合して確認
SELECT 
  p.id,
  u.email,
  p.full_name,
  p.username,
  p.is_admin,
  p.is_employee
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
LIMIT 5;

