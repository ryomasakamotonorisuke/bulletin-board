# ログインエラー（400 Bad Request）の解決方法

## エラーの原因

`POST https://phbizanrnmjqtiybagzw.supabase.co/auth/v1/token?grant_type=password 400 (Bad Request)`

このエラーは、以下の可能性があります：

1. **ユーザーが存在しない**
2. **パスワードが間違っている**
3. **メールアドレスが間違っている**

---

## 解決手順

### ステップ1: Supabaseでユーザーを確認

Supabaseダッシュボードで確認：
1. https://supabase.com にアクセス
2. プロジェクトを選択
3. **Authentication → Users**
4. 登録されているユーザーを確認

### ステップ2: 管理者ユーザーを作成（存在しない場合）

#### 方法1: Supabaseダッシュボードから作成（推奨）

1. **Authentication → Users → "Add user"**
2. 以下を入力：
   - **Email**: `admin@admin.com`
   - **Password**: `admin123`
   - **Auto confirm user**: ✅ チェック
   - **Send email**: ❌ チェックしない
3. **Create user** をクリック

#### 方法2: SQLで管理者を作成

```sql
-- SQL Editorで実行
-- QUICK_SETUP.sql の内容を実行
```

### ステップ3: profilesテーブルを更新

Supabase SQL Editorで以下を実行：

```sql
-- 管理者を設定（既存のユーザーを管理者にする場合）
UPDATE profiles 
SET 
  is_admin = TRUE,
  is_active = TRUE,
  user_id = email
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@admin.com'
);

-- または、最初のユーザーを管理者にする場合
UPDATE profiles 
SET 
  is_admin = TRUE,
  is_active = TRUE,
  is_employee = TRUE
WHERE id IN (
  SELECT id FROM auth.users ORDER BY created_at LIMIT 1
);
```

### ステップ4: データベーススキーマを更新

Supabase SQL Editorで `QUICK_SETUP.sql` を実行してください。

---

## ログインテスト

1. **メールアドレス**: Supabaseで登録されているメールアドレス
2. **パスワード**: Supabaseで登録されているパスワード
3. ログインボタンをクリック

---

## トラブルシューティング

### エラーが続く場合

1. ブラウザのコンソール（F12）でエラーを確認
2. Supabaseでユーザーが正しく作成されているか確認
3. パスワードをリセットしてから再試行

### 新しいカラムがエラーの場合

Supabase SQL Editorで以下を実行：

```sql
-- QUICK_SETUP.sql を実行
```

これで新しいカラムが追加され、エラーが解決します。

---

## デフォルト管理者情報

作成した管理者アカウント：
- **メールアドレス**: `admin@admin.com`
- **パスワード**: `admin123`

このアカウントでログインしてください。

