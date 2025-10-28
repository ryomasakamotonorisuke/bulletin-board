-- 管理者アカウントを作成するSQL
-- ⚠️ これはSupabaseダッシュボードから実行します

-- Supabaseダッシュボードで管理者を作成する方法：
-- 1. Supabaseダッシュボード → Authentication → Users
-- 2. "Add user" をクリック
-- 3. 以下を入力：
--    - Email: admin@admin.com
--    - Password: admin123
--    - Auto confirm user: ✅ チェック
--    - Send email: ❌ チェックしない
-- 4. "Create user" をクリック
-- 5. 作成後、profilesテーブルを更新

-- 6. profilesテーブルを更新（AuthダッシュボードでユーザーIDを確認してから）
UPDATE profiles 
SET 
  is_admin = TRUE,
  is_active = TRUE,
  password_changed = FALSE,
  full_name = '管理者',
  username = 'admin',
  user_id = 'admin@admin.com'
WHERE id = '作成されたユーザーのID';  -- ここにAuthダッシュボードから取得したIDを入力

-- 確認
SELECT * FROM profiles WHERE is_admin = true;

