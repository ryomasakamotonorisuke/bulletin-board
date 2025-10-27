# 🚀 デプロイガイド - 最新版

## 実装完了した機能

### ✅ 認証システム変更
- メールアドレスなし（ユーザーIDとパスワードのみ）
- ユーザー自己登録を無効化
- 管理者のみがユーザーを作成可能
- 初回ログイン時にパスワード変更を強制

### ✅ 管理者機能拡張
- ユーザー一覧にオンオフトグル（アクティブ/無効）
- CSVエクスポート機能
- CSVインポート機能（UI実装済み、機能実装予定）
- ダッシュボード追加（統計情報表示）

---

## 必要なデータベース変更

### Supabase SQL Editorで実行

以下のSQLを実行してください：

```sql
-- 1. profilesテーブルにカラムを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;

-- 2. 既存データの移行（emailの値をuser_idにコピー）
UPDATE profiles 
SET user_id = email 
WHERE user_id IS NULL AND email IS NOT NULL;

-- 3. インデックスを作成
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);

-- 4. 既存のユーザーをアクティブに設定
UPDATE profiles SET is_active = TRUE WHERE is_active IS NULL;

-- 5. パスワード変更フラグをfalseに設定（初回変更を強制）
UPDATE profiles SET password_changed = FALSE WHERE password_changed IS NULL;
```

ファイル: `update-schema-userid-auth.sql` を参照

---

## デプロイ方法

### Vercelでデプロイ

GitHubにプッシュされたので、Vercelが自動的にデプロイを開始します。

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にアクセス
   - プロジェクト「bulletin-board」を選択

2. **デプロイ状況を確認**
   - 「Deployments」タブで最新のデプロイを確認
   - ステータスが「Building」→「Ready」になるまで待つ

3. **完了**
   - ステータスが「Ready」（緑色）になったら完了
   - URLをクリックしてアクセス

---

## 初回セットアップ

### 1. データベースの変更
上記のSQLを実行してください。

### 2. 管理者アカウントの作成

方法1: ローカルで作成
```bash
cd bulletin-board
# .env.localを設定（既に設定済み）
# create-admin-user.jsを修正してuser_idを使用するように変更が必要

# 簡単な方法：Supabaseダッシュボードで直接作成
```

方法2: Supabaseダッシュボードで作成
1. Supabaseダッシュボード → Authentication → Users
2. 「Add user」をクリック
3. Email（user_id）: `admin01`
4. Password: `admin123`
5. Auto confirm user: 有効
6. 作成後、profilesテーブルで以下を設定：
   - `user_id`: `admin01`
   - `is_admin`: `true`
   - `is_active`: `true`
   - `password_changed`: `false`（初回ログイン時にパスワード変更を強制）

---

## 新機能の使い方

### ユーザー作成
1. 管理者でログイン
2. 管理画面 → ユーザー作成
3. ユーザーID（ユーザー名）、パスワード、氏名を入力
4. 管理者権限が必要な場合はチェック
5. 作成

### オンオフトグル
- ユーザー管理画面で各ユーザーの状態をクリック
- アクティブ ↔ 無効 を切り替え
- 無効なユーザーはログインできない

### CSVエクスポート
- ユーザー管理画面 → CSVエクスポートボタン
- ユーザー一覧をCSVファイルでダウンロード

### ダッシュボード
- 管理画面の「ダッシュボード」タブ
- 総ユーザー数、管理者数、投稿数などの統計情報を表示

---

## トラブルシューティング

### ログインできない
- ユーザーIDとパスワードが正しいか確認
- Supabaseでユーザーが存在するか確認
- `is_active` が `true` か確認

### 初回ログイン時にパスワード変更画面が表示されない
- データベースの `password_changed` フラグを `false` に設定
- ページをリロード

### CSVエクスポートが動作しない
- ブラウザのダウンロード設定を確認
- ポップアップブロッカーを無効化

---

## 次のステップ（今後の追加予定）

1. CSVインポート機能の完全実装
2. ユーザーグループ機能
3. 詳細なアクセスログ
4. メール通知機能

---

## 変更ファイル一覧

### 新規作成
- `src/components/admin/Dashboard.tsx`
- `src/components/auth/PasswordChangeRequired.tsx`
- `update-schema-userid-auth.sql`

### 変更
- `src/app/admin/page.tsx` - ダッシュボードタブ追加
- `src/app/page.tsx` - 初回パスワード変更チェック
- `src/components/admin/CreateAdminForm.tsx` - user_id対応
- `src/components/admin/UserManagement.tsx` - CSV機能追加
- `src/components/auth/ModernLoginForm.tsx` - user_id認証
- `src/contexts/AuthContext.tsx` - パスワード変更強制機能
- `src/hooks/useAdmin.ts` - user_id対応
- `src/hooks/useAdminUsers.ts` - user_id対応
- `src/types/index.ts` - 型定義更新

---

## デプロイURL

デプロイが完了したら、以下のURLからアクセスできます：
- Production: https://bulletin-board-omega-nine.vercel.app/

