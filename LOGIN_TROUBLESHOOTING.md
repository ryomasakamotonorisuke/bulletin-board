# ログインできない問題の解決方法

## 考えられる原因

### 1. データベーススキーマが更新されていない
**現在のSupabaseデータベースには、新しいカラムが存在しません**

必要なカラム：
- `user_id` - ユーザーID
- `is_active` - ユーザーのアクティブ状態
- `password_changed` - パスワード変更フラグ

### 2. 既存ユーザーと新しい認証方法の不一致
- 既存のユーザーはメールアドレスで登録されている
- 新しいシステムは「ユーザーID」を要求している
- user_idカラムが設定されていないとエラーになる

### 3. ログイン時に使用する認証情報の問題
- ユーザーID = メールアドレス（Supabase互換のため）
- 既存ユーザーはメールアドレスでログイン可能

---

## 解決方法

### 方法1: データベーススキーマを更新（推奨）

Supabase SQL Editorで以下を実行：

```sql
-- 新しいカラムを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;

-- 既存データを移行（emailをuser_idにコピー）
UPDATE profiles 
SET user_id = email 
WHERE user_id IS NULL AND email IS NOT NULL;

-- インデックス作成
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);

-- デフォルト値設定
UPDATE profiles SET is_active = TRUE WHERE is_active IS NULL;
UPDATE profiles SET password_changed = FALSE WHERE password_changed IS NULL;
```

### 方法2: とりあえずログインできるようにする（一時的）

既存のメールアドレスでログインしてください：

1. **ログインフォームで「ユーザーID」欄に既存のメールアドレスを入力**
   - 例：`admin@admin.com` または `test@test.com`
   
2. **パスワードを入力**

3. **ログインボタンをクリック**

これでログインできるはずです（データベース更新後）。

---

## 一時的な修正：メールアドレス表示を戻す

もし今すぐログインしたい場合、ログインフォームを一時的に修正できます：

### オプション1: ログイン画面を修正（簡単）

`src/components/auth/ModernLoginForm.tsx` の13行目を一時的に変更：

```typescript
// 変更前
const [user_id, setUser_id] = useState('')

// 変更後（わかりやすく）
const [user_id, setUser_id] = useState('')  // メールアドレスまたはユーザーID
```

そしてラベルを変更：

```typescript
// 変更前
<label className="block text-sm font-bold mb-2 japanese" style={{ color: '#011623' }}>
  ユーザーID
</label>

// 変更後
<label className="block text-sm font-bold mb-2 japanese" style={{ color: '#011623' }}>
  ユーザーIDまたはメールアドレス
</label>
```

### オプション2: ブラウザのコンソールで確認

ログインを試行して、ブラウザのコンソール（F12）でエラーを確認：

1. F12キーで開発者ツールを開く
2. Consoleタブを開く
3. ログインを試行
4. エラーメッセージを確認

よくあるエラー：
```
Profile fetch error, using defaults: ...
```
→ これは正常です（データベースに新しいカラムがないため）

```
Invalid login credentials
```
→ メールアドレスまたはパスワードが間違っている

```
This account is disabled
```
→ ユーザーが無効化されている

---

## 現在の状況

✅ コード修正完了（互換性エラーを修正）
✅ GitHubにプッシュ完了
✅ Vercelでデプロイ中

❓ **データベーススキーマ更新が必要**
❓ **既存ユーザーのメールアドレスを確認する必要がある**

---

## 今すぐ試せること

### 1. 既存のメールアドレスでログイン

Supabaseダッシュボードで確認：
1. https://supabase.com にアクセス
2. プロジェクトを選択
3. Authentication → Users
4. 登録されているメールアドレスを確認
5. そのメールアドレスを「ユーザーID」欄に入力してログイン

### 2. データベーススキーマを更新

上記のSQLを実行すれば、新しい機能が正常に動作します。

### 3. 新しいユーザーを作成

データベース更新後、管理者画面から新しいユーザーを作成してください。

---

## まとめ

**ログインできない原因は、データベースに新しいカラムがないためです。**

**解決方法：**
1. データベーススキーマを更新する（必須）
2. 既存のメールアドレスでログイン（一時的）
3. 新しいユーザーを作成する

