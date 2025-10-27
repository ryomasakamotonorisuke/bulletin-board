# デプロイ手順

このアプリはSupabaseを使っているため、以下の2つの方法でデプロイできます：

## 🚀 方法1: Vercel（推奨・最も簡単）

VercelはNext.jsを開発した会社が運営するホスティングサービスで、**完全無料**でNext.jsアプリをデプロイできます。

### 手順

1. **GitHubにプッシュ**
```bash
cd bulletin-board
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

2. **Vercelにアカウント作成**
   - https://vercel.com にアクセス
   - GitHubアカウントでログイン

3. **プロジェクトをインポート**
   - "Add New..." → "Project"
   - GitHubリポジトリを選択
   - 環境変数を設定：
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_APP_URL` (自動生成されるURL)
   - "Deploy" をクリック

4. **完了！**
   - 数分でデプロイ完了
   - 自動的にHTTPS対応
   - 更新すると自動再デプロイ

### メリット
- ✅ 完全無料
- ✅ 自動HTTPS
- ✅ GitHub連携で自動デプロイ
- ✅ 簡単設定
- ✅ 高速なCDN配信

---

## 🌐 方法2: Xserver

日本のレンタルサーバー「Xserver」にデプロイする場合。

### 必要な設定

1. **next.config.tsの確認**
```typescript
// 静的エクスポートに設定済み
output: 'export'
```

2. **ビルド**
```bash
npm run build
```

3. **outフォルダを確認**
```bash
# .next/out または out フォルダが生成される
```

4. **Xserverにアップロード**
   - XserverのFTPまたはFileZillaを使用
   - `public_html` フォルダに全ファイルをアップロード
   - ファイル構造：
     ```
     public_html/
       ├── index.html
       ├── _next/
       ├── files/ (画像など)
       └── ...
     ```

5. **環境変数の設定**
   - `.env.local` の内容を確認
   - 本番URLを更新

### 注意点
- ⚠️ XserverはNode.js環境ではないため、静的HTMLとして動作
- ⚠️ API Routesは使えない
- ⚠️ Server Componentsは使えない
- ✅ クライアントサイドの機能は正常に動作

---

## 📝 推奨デプロイ方法

**Vercelを使用することを強く推奨します。**

理由：
1. 完全無料
2. Next.jsに最適化
3. 自動デプロイ
4. 高速
5. 設定が簡単

---

## 🔧 ビルドコマンド

```bash
# 開発環境
npm run dev

# 本番ビルド
npm run build

# プレビュー
npm run preview
```

---

## 🌍 カスタムドメイン設定

Vercelの場合：
1. Vercelダッシュボード → Settings → Domains
2. ドメインを追加
3. DNS設定（CNAME）を追加

Xserverの場合：
1. Xserver管理画面でドメイン設定
2. DNS設定を確認
3. SSL証明書を有効化

---

## 🛠️ トラブルシューティング

### 画像が表示されない
- Supabase Storageの公開設定を確認
- バケットのポリシーを確認

### 認証が機能しない
- 環境変数が正しく設定されているか確認
- Supabaseの認証設定を確認

### デプロイエラー
- ビルドログを確認
- `.env` ファイルが正しく設定されているか確認


