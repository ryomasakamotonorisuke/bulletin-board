# 管理者ユーザーの作成手順（詳細版）

## エラーの原因

```
Invalid login credentials
```

`admin@admin.com`のユーザーがSupabaseに登録されていません。

---

## 手順1: Supabaseでユーザーを作成

### 1-1. Supabaseダッシュボードにアクセス
1. https://supabase.com にアクセス
2. プロジェクトを選択
3. 左メニューから「Authentication」をクリック
4. 「Users」タブをクリック

### 1-2. ユーザーを作成
1. 「Add user」または「Invite」ボタンをクリック
2. 以下を入力：
   - **Email**: `admin@admin.com`
   - **Password**: `admin123`
   - **Auto Confirm User**: ✅ **必須でチェック**
   - **Send email**: ❌ チェックしない
3. 「Create user」または「Send invitation」をクリック

### 1-3. ユーザーIDを確認
作成されたユーザーの一覧から、`admin@admin.com`のユーザーIDをコピー（例：`xxxxx-xxxx-xxxx-xxxx-xxxxx`）

---

## 手順2: profilesテーブルを更新

### 2-1. SQL Editorを開く
1. 左メニューから「SQL Editor」をクリック
2. 「New query」をクリック

### 2-2. 以下のSQLを実行

```sql
-- ステップ1: profilesテーブルにカラムを追加（存在しない場合）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;

-- ステップ2: ユーザーIDをprofilesに設定
UPDATE profiles p
SET 
  is_admin = TRUE,
  is_active = TRUE,
  is_employee = TRUE,
  user_id = u.email,
  full_name = COALESCE(p.full_name, '管理者'),
  username = COALESCE(p.username, 'admin')
WHERE p.id = u.id AND u.email = 'admin@admin.com';

-- 確認
SELECT 
  u.email,
  p.is_admin,
  p.is_active,
  p.full_name,
  u.id as ユーザーID
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'admin@admin.com';
```

---

## 手順3: ログインテスト

1. http://localhost:3001 または デプロイされたURLにアクセス
2. 以下でログイン：
   - **メールアドレス**: `admin@admin.com`
   - **パスワード**: `admin123`

---

## トラブルシューティング

### エラー: "relation profiles does not exist"
プロジェクトを確認してください。正しいプロジェクトを選択していますか？

### エラー: "duplicate key value violates unique constraint"
ユーザーは既に存在しています。別のメールアドレスで作成してください。

### ユーザーを作成できない場合
1. Supabaseのクォータを確認
2. 既存のユーザー数を確認
3. 既存のユーザーを削除してから再作成

---

## 完了後

ログインが成功すると、管理画面にアクセスできます。

URL: http://localhost:3001/admin

