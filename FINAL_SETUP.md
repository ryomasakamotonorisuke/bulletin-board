# 最終セットアップ手順

## 完了した実装
✅ メールアドレス入力欄を維持
✅ 既存データの整理準備（管理者ユーザーは残す）
✅ 初回ログイン時のパスワード変更強制
✅ 管理者機能拡張（CSV、オンオフトグル、ダッシュボード）

---

## データベース整理手順

### ステップ1: Supabase SQL Editorで実行

1. Supabaseダッシュボードにアクセス
2. SQL Editorを開く
3. 以下のSQLを実行

```sql
-- 管理者の確認
SELECT id, email, full_name, is_admin FROM profiles WHERE is_admin = true;

-- これを実行して、管理者の情報をメモしてください
```

### ステップ2: データを削除

管理者ユーザーのIDを確認したら：

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

-- 管理者ユーザーにuser_idを設定
UPDATE profiles 
SET user_id = email 
WHERE user_id IS NULL AND email IS NOT NULL;

-- デフォルト値を設定
UPDATE profiles SET is_active = TRUE WHERE is_active IS NULL;
UPDATE profiles SET password_changed = FALSE WHERE password_changed IS NULL;

-- インデックス作成
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);
```

### ステップ3: 確認

```sql
-- 結果を確認
SELECT id, email, full_name, is_admin, is_active, password_changed FROM profiles;
```

---

## ログイン方法

### 管理者アカウントでログイン

1. デプロイされたサイトにアクセス
2. メールアドレス欄に管理者のメールアドレスを入力
3. パスワードを入力
4. ログイン

**注意:** 初回ログイン時にパスワード変更を求められます。

---

## 新しいユーザーの作成

1. 管理者でログイン
2. 「管理者ダッシュボード」をクリック
3. 「ユーザー作成」タブを選択
4. 以下を入力：
   - **ユーザーID**: `user001` など
   - **パスワード**: 6文字以上
   - **氏名**: ユーザーの名前
   - **管理者権限**: 必要に応じてチェック
5. 「ユーザーを作成」をクリック

作成されたユーザーは、初回ログイン時にパスワード変更が求められます。

---

## 機能の使い方

### 1. ダッシュボード
- 管理画面の最初のタブ
- 総ユーザー数、管理者数、投稿数などを表示

### 2. ユーザー管理
- ユーザー一覧を表示
- **状態トグル**: アクティブ/無効を切り替え
- **CSVエクスポート**: ユーザー一覧をダウンロード
- **管理者権限**: クリックして切り替え

### 3. 投稿管理
- 全投稿を管理
- 投稿の編集・削除

---

## トラブルシューティング

### ログインできない
- Supabaseでユーザーが存在するか確認
- メールアドレスとパスワードが正しいか確認
- ブラウザのコンソール（F12）でエラーを確認

### 初回ログイン時にパスワード変更画面が表示されない
- データベースの `password_changed` を `false` に設定
- ページをリロード

### 管理者画面にアクセスできない
- `is_admin` が `true` か確認
- データベースで確認: `SELECT * FROM profiles WHERE email = 'your@email.com';`

---

## デプロイ確認

最新の変更がデプロイされたら確認してください：
- URL: https://bulletin-board-omega-nine.vercel.app/
- ログインフォームのラベルが「メールアドレス」になっている
- ログインが可能になっている

