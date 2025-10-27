# 権限システム実装完了

## ✅ 実装内容

### 1. データベーススキーマ
- `profiles.role` - ユーザーロール（admin/poster/viewer/store）
- `posts.post_type` - 投稿タイプ（user/store）

### 2. タブ機能
- **すべて** - 全投稿を表示
- **ユーザー投稿** - ユーザー投稿のみ表示、管理者・投稿者のみ投稿可能
- **店舗投稿** - 店舗投稿のみ表示、店舗のみ投稿可能  
- **人気投稿** - いいね・コメント数でソート表示

### 3. 権限チェック
- ユーザー投稿タブ: `canCreateUserPost()` でボタン表示制御
- 店舗投稿タブ: `canCreateStorePost()` でボタン表示制御
- 投稿時に`post_type`を自動設定

### 4. UI改善
- 各タブにアイコン表示（ユーザー投稿・店舗投稿）
- 投稿数と現在のロール表示
- タブごとの適切な空メッセージ
- 検索・ソート機能を全タブで利用可能

## 📝 実装ファイル

- `update-user-roles.sql` - データベーススキーマ変更
- `src/lib/permissions.ts` - 権限チェック関数
- `src/hooks/useUserRole.ts` - ユーザーロール取得
- `src/components/admin/CreateAdminForm.tsx` - ユーザー作成（ロール選択）
- `src/components/PostForm.tsx` - 投稿フォーム（post_type対応）
- `src/hooks/usePosts.ts` - 投稿作成（post_type追加）
- `src/app/page.tsx` - タブ表示と権限制御

## 🚀 使用方法

1. **SupabaseでSQLを実行**:
   ```sql
   -- update-user-roles.sql を実行
   ```

2. **ユーザー作成時**:
   - 管理者画面 → ユーザー作成
   - ユーザー種別を選択（管理者/投稿者/閲覧者/店舗）

3. **投稿**:
   - ユーザー投稿タブ: 管理者・投稿者が投稿可能
   - 店舗投稿タブ: 店舗のみ投稿可能
   - 権限がないユーザーはボタンが非表示

## 📊 動作仕様

| タブ | 表示内容 | 投稿可能 | いいね/コメント |
|------|---------|---------|--------------|
| すべて | 全投稿 | - | 全員 |
| ユーザー投稿 | post_type='user' | 管理者・投稿者 | 全員 |
| 店舗投稿 | post_type='store' | 店舗 | 全員 |
| 人気投稿 | 全投稿（いいね数順） | - | 全員 |


