# ユーザー作成機能の制限について

## 現在の問題

403エラー：`/auth/v1/admin/users` にアクセスできない

これは、クライアント側から管理者権限のAPIにアクセスできないためです。

## 解決方法

### オプション1: Supabaseダッシュボードから手動で作成（推奨）

1. Supabaseダッシュボードにアクセス
2. Authentication → Users → "Add user"
3. 以下を入力：
   - Email: `新規ユーザーのメールアドレス`
   - Password: `パスワード`
   - Auto confirm: ✅
4. 作成後、profilesテーブルを更新：

```sql
UPDATE profiles 
SET 
  is_admin = TRUE,  -- 管理者にする場合
  is_active = TRUE,
  full_name = 'ユーザー名'
WHERE email = 'ユーザーのメールアドレス';
```

### オプション2: API Routeを作成（サーバーサイド）

まだ実装されていません。

## 一時的な対応

現在、ユーザー作成機能は**使用できません**。

代わりに：
1. Supabaseダッシュボードから手動でユーザーを作成
2. SQLでprofilesテーブルを更新

## 今後の実装

- API Routeを作成してサーバーサイドでユーザーを作成
- または、Supabase Functionsを使用

