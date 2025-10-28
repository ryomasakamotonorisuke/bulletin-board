# データベース修正 - 最終版

## ⚠️ エラーの原因

```
ERROR: column "email" does not exist
```

**原因**: profilesテーブルには`email`カラムが存在しません。
Supabase Authのユーザー情報は`auth.users`テーブルに格納されています。

---

## ✅ 正しい解決方法

### ステップ1: 現在の構造を確認

Supabase SQL Editorで以下を実行：

```sql
-- profilesテーブルの構造を確認
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;
```

### ステップ2: データ確認

```sql
-- 既存のデータとauth.usersを結合して確認
SELECT 
  p.id,
  u.email as auth_email,
  p.full_name,
  p.username,
  p.is_admin
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC;
```

### ステップ3: データを整理（管理者以外を削除）

```sql
-- 管理者のIDを確認
SELECT id, username, full_name, is_admin 
FROM profiles 
WHERE is_admin = true;

-- 投稿データを削除
DELETE FROM comments;
DELETE FROM likes;
DELETE FROM posts;

-- 管理者以外を削除（管理者のIDを確認してから実行）
-- DELETE FROM profiles WHERE id != '管理者のID';
```

### ステップ4: 新しいカラムを追加

```sql
-- 新しいカラムを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;
```

### ステップ5: auth.usersからemailを取得してuser_idに設定

```sql
UPDATE profiles p
SET user_id = u.email
FROM auth.users u
WHERE p.id = u.id 
  AND p.user_id IS NULL 
  AND u.email IS NOT NULL;
```

### ステップ6: デフォルト値を設定

```sql
UPDATE profiles SET is_active = TRUE WHERE is_active IS NULL;
UPDATE profiles SET password_changed = FALSE WHERE password_changed IS NULL;
```

### ステップ7: インデックス作成

```sql
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);
CREATE INDEX IF NOT EXISTS profiles_password_changed_idx ON profiles(password_changed);
```

### ステップ8: 結果確認

```sql
SELECT 
  p.id,
  u.email as login_email,
  p.user_id,
  p.full_name,
  p.is_admin,
  p.is_active,
  p.password_changed
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at;
```

---

## 🔑 ログイン方法

データベース更新後、以下の情報でログインできます：

1. **メールアドレス欄**: auth.usersのemail（例：`admin@admin.com`）
2. **パスワード**: 設定したパスワード
3. 初回ログイン時にパスワード変更を求められます

---

## 📝 手順のまとめ

1. `check-profiles-table.sql` を実行して構造確認
2. 管理者のIDを確認
3. `fix-database-proper.sql` の内容を順番に実行
4. デプロイ確認
5. ログインテスト

すべてのファイルは `bulletin-board` フォルダにあります。

