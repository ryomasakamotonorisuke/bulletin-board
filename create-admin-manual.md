# 管理者アカウント手動作成手順

## 1. データベースのセットアップ

SupabaseのSQL Editorで `setup-database-simple.sql` の内容を実行してください。

## 2. 管理者アカウントの作成

### 方法A: Supabase管理画面で作成

1. **Supabaseダッシュボード**にアクセス
2. **Authentication** → **Users** をクリック
3. **Add user** をクリック
4. 以下の情報を入力：
   - **Email**: `admin@admin.com`
   - **Password**: `admin`
   - **Email Confirm**: ✅ チェック
   - **User Metadata**: `{"full_name": "管理者"}`
5. **Create user** をクリック
6. 作成されたユーザーのIDをコピー

### 方法B: SQLで直接作成

```sql
-- 1. 認証ユーザーを作成（Supabase管理画面で実行）
-- 2. プロフィールを作成
INSERT INTO profiles (id, username, full_name, is_admin)
VALUES ('USER_ID_FROM_AUTH', 'admin', '管理者', true);
```

## 3. ストレージの設定

1. **Storage** → **Buckets** をクリック
2. **New bucket** をクリック
3. **Name**: `post-images`
4. **Public bucket**: ✅ チェック
5. **Create bucket** をクリック

## 4. ストレージポリシーの設定

Storage → Policies で以下を追加：

```sql
-- 画像のアップロードを許可
CREATE POLICY "Users can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 画像の表示を許可
CREATE POLICY "Images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'post-images');

-- 画像の削除を許可
CREATE POLICY "Users can delete own images" ON storage.objects
FOR DELETE USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 5. ログインテスト

1. アプリケーションにアクセス: `http://localhost:3000`
2. ログイン情報を入力：
   - **メールアドレス**: `admin@admin.com`
   - **パスワード**: `admin`
3. ログイン成功後、ヘッダーのユーザーメニューから「管理者ページ」にアクセス

## 6. 管理者ページの確認

- 管理者ページでユーザー管理機能を確認
- 新しい管理者ユーザーの作成をテスト
- 投稿管理機能をテスト


