# 権限システム実装ガイド

## データベースの変更

SupabaseのSQL Editorで以下を実行してください：

```sql
-- update-user-roles.sql の内容を実行
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'viewer';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'user';

-- 既存データの移行
UPDATE profiles 
SET role = CASE 
  WHEN is_admin = TRUE THEN 'admin'
  ELSE 'viewer'
END
WHERE role = 'viewer' OR role IS NULL;

UPDATE profiles 
SET role = 'poster'
WHERE is_employee = TRUE AND role = 'viewer' AND is_admin = FALSE;

-- インデックス
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS posts_post_type_idx ON posts(post_type);
```

## ユーザーロール

| ロール | ユーザー投稿 | 店舗投稿 | いいね/コメント |
|--------|------------|---------|--------------|
| **管理者 (admin)** | ✅ 投稿可能 | ❌ 不可 | ✅ 可能 |
| **投稿者 (poster)** | ✅ 投稿可能 | ❌ 不可 | ✅ 可能 |
| **閲覧者 (viewer)** | ❌ 不可 | ❌ 不可 | ✅ 可能 |
| **店舗 (store)** | ❌ 不可 | ✅ 投稿可能 | ✅ 可能 |

## タブの機能

### 1. **すべて**タブ
- 全投稿を表示
- 全ユーザーが閲覧可能

### 2. **ユーザー投稿**タブ
- `post_type='user'`の投稿のみ表示
- 投稿可能: **管理者、投稿者**のみ
- 閲覧者・店舗はいいね/コメントのみ

### 3. **店舗投稿**タブ
- `post_type='store'`の投稿のみ表示
- 投稿可能: **店舗**のみ
- その他はいいね/コメントのみ

### 4. **人気投稿**タブ
- いいね・コメント数でソート
- 全タイプの投稿を含む

## 使い方

### ユーザー作成時

1. 管理者画面の「ユーザー作成」タブを開く
2. 基本情報（メール、パスワード、氏名）を入力
3. **ユーザー種別**を選択：
   - 管理者（全権限）
   - 投稿者（ユーザー投稿のみ可能）
   - 閲覧者（いいね・コメントのみ）
   - 店舗（店舗投稿のみ可能）

### 投稿時の権限チェック

- **ユーザー投稿タブ**: 管理者・投稿者のみ「新しい投稿」ボタンが表示
- **店舗投稿タブ**: 店舗のみ「新しい投稿」ボタンが表示
- それ以外のユーザーはボタンが非表示

## フック

### `useUserRole()`
現在のユーザーのroleを取得

```typescript
const { userRole, loading } = useUserRole()
// userRole: 'admin' | 'poster' | 'viewer' | 'store'
```

### `permissions.ts`
権限チェック関数

```typescript
import { canCreateUserPost, canCreateStorePost } from '@/lib/permissions'

if (canCreateUserPost(userRole)) {
  // ユーザー投稿を作成可能
}
```

## 実装ファイル

- `update-user-roles.sql` - データベーススキーマ変更
- `src/lib/permissions.ts` - 権限チェック関数
- `src/hooks/useUserRole.ts` - ユーザーロール取得フック
- `src/components/admin/CreateAdminForm.tsx` - ユーザー作成フォーム（ロール選択付き）
- `src/app/page.tsx` - タブ表示と権限チェック

## 注意事項

1. **既存ユーザー**: 既存の`is_admin`フラグに基づいて`role`が設定されます
2. **投稿タイプ**: 投稿作成時に自動的に`post_type`が設定されます
3. **RLSポリシー**: 必要に応じて更新してください



