# セットアップ手順（管理者ユーザーを残す）

## 🎯 目標
- ✅ 既存の投稿データを削除
- ✅ 管理者以外のユーザーを削除
- ✅ 管理者ユーザーを残す
- ✅ 新しいカラムを追加
- ✅ ログインできるようにする

---

## 📋 手順

### ステップ1: 管理者ユーザーを確認

Supabase SQL Editorで実行：

```sql
SELECT id, email, full_name, is_admin, created_at 
FROM profiles 
WHERE is_admin = true
ORDER BY created_at;
```

**結果をメモしてください**（メールアドレス、IDなど）

### ステップ2: データベース整理

`clean-and-setup.sql` の内容をSupabase SQL Editorで実行：

```sql
-- 投稿関連のデータを削除
DELETE FROM comments;
DELETE FROM likes;
DELETE FROM posts;

-- 管理者以外のプロフィールを削除
DELETE FROM profiles WHERE is_admin = false;

-- 新しいカラムを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;

-- 管理者ユーザーにuser_idを設定（emailを使用）
UPDATE profiles 
SET user_id = email 
WHERE user_id IS NULL AND email IS NOT NULL;

-- デフォルト値を設定
UPDATE profiles SET is_active = TRUE WHERE is_active IS NULL;
UPDATE profiles SET password_changed = FALSE WHERE password_changed IS NULL;

-- インデックス作成
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);
CREATE INDEX IF NOT EXISTS profiles_password_changed_idx ON profiles(password_changed);

-- 結果を確認
SELECT 
  id, 
  email, 
  full_name, 
  user_id,
  is_admin, 
  is_active, 
  password_changed
FROM profiles
ORDER BY created_at;
```

### ステップ3: デプロイの確認

Vercelでデプロイが完了したら：
- URL: https://bulletin-board-omega-nine.vercel.app/

### ステップ4: ログイン

1. 管理者のメールアドレスとパスワードでログイン
2. 初回ログイン時にパスワード変更を求められます
3. 新しいパスワードを設定

### ステップ5: 新しいユーザーを作成

1. 管理者でログイン
2. 管理画面 → ユーザー作成
3. 以下を入力：
   - **ユーザーID**: `user001`など
   - **パスワード**: 6文字以上
   - **氏名**: ユーザー名
   - **管理者権限**: 必要に応じて
4. 「ユーザーを作成」をクリック

新しいユーザーは、初回ログイン時にパスワード変更が求められます。

---

## ✅ 完了

これで、以下の状態になります：

- ✅ 管理者ユーザーのみが存在
- ✅ メールアドレスでログイン可能
- ✅ 初回ログイン時にパスワード変更を強制
- ✅ 管理者のみがユーザーを作成可能
- ✅ CSVエクスポート/インポート機能
- ✅ ダッシュボード機能
- ✅ ユーザーのオンオフトグル

---

## 🎉 使い始める

1. ログイン
2. 管理画面で新しいユーザーを作成
3. 機能をテスト

お疲れ様でした！

