# 🚀 クイックデプロイ手順（5分で公開）

## 方法1: Vercel（最も簡単・推奨）

### ステップ1: GitHubにプッシュ

```bash
# Git初期化（まだの場合）
cd bulletin-board
git init
git add .
git commit -m "Initial commit"

# GitHubにプッシュ
git remote add origin https://github.com/ユーザー名/リポジトリ名.git
git push -u origin main
```

まだGitHubアカウントがない場合：
- https://github.com でアカウント作成
- 「New repository」でリポジトリ作成

### ステップ2: Vercelでデプロイ

1. **Vercelにアクセス**
   - https://vercel.com を開く
   - 「Sign Up」→ GitHubアカウントでログイン

2. **プロジェクトをインポート**
   - 「Add New...」→ 「Project」
   - GitHubから作成したリポジトリを選択

3. **環境変数を設定**
   - 以下の環境変数を追加：
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://phbizanrnmjqtiybagzw.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDg1MDEsImV4cCI6MjA3Njk4NDUwMX0.VPfLNw_a8SKt46Cb4Szb6MRLucVWo6UspW6V8ipCRqE
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQwODUwMSwiZXhwIjoyMDc2OTg0NTAxfQ.x2MEHyHFBDWFlZe-LmF7xOlEntmT8O7gfxSJjAbkpus
     ```

4. **デプロイボタンをクリック**
   - 自動でビルド開始
   - 完了まで2-3分

5. **URL取得**
   - デプロイ完了後にURLが表示されます
   - 例: `https://your-app-name.vercel.app`

### 完了！
- ✅ アプリが公開されました
- ✅ HTTPS対応
- ✅ 無料プランでOK

---

## 方法2: Netlify（代替案）

1. https://netlify.com にアクセス
2. GitHubアカウントでログイン
3. 「Sites」→ 「Add new site」→ 「Import from Git」
4. 環境変数を設定
5. デプロイ

---

## トラブルシューティング

### ビルドエラーが出る場合
```bash
# エラーを確認して修正
npm run build
```

### 画像が表示されない
- Supabase Storageの設定を確認
- `files`バケットがpublicか確認

### 認証が機能しない
- 環境変数が正しく設定されているか確認
- Supabase Auth設定を確認

---

## 次のステップ

### カスタムドメインの設定
1. Vercelダッシュボード → Settings → Domains
2. ドメインを追加（例: `app.yourdomain.com`）
3. DNS設定（CNAME）を追加

### 自動デプロイ
- GitHubにpushするたびに自動でデプロイされます

