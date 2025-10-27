# Vercelデプロイ手順（詳細）

## 現在の状態
✅ Vercel CLI インストール済み
⏳ 認証待ち

## 次のステップ

### 1. ブラウザで認証

表示されたURLにアクセス：
```
https://vercel.com/oauth/device?user_code=JGSC-SHQN
```

または、別の方法：

1. **ブラウザでVercelにアクセス**
   - https://vercel.com
   - 「Sign Up」または「Log In」
   - GitHubアカウントでログイン

2. **トークンを生成**
   - https://vercel.com/account/tokens
   - 「Create Token」→ 「Full Account Access」
   - トークンをコピー

3. **CLIでログイン**
```powershell
vercel login
# トークンを貼り付け
```

### 2. デプロイ

認証完了後：

```powershell
# bulletin-boardディレクトリに移動
cd C:\Users\yuhei\Desktop\00000\bulletin-board

# デプロイを開始
vercel
```

プロンプトに答えます：
- Set up and deploy? → **Y**
- Link to existing project? → **N**
- In which directory? → `./`

### 3. 環境変数を設定

デプロイ後、環境変数を追加：

```powershell
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 値を入力: https://phbizanrnmjqtiybagzw.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# 値を入力: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDg1MDEsImV4cCI6MjA3Njk4NDUwMX0.VPfLNw_a8SKt46Cb4Szb6MRLucVWo6UspW6V8ipCRqE

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# 値を入力: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQwODUwMSwiZXhwIjoyMDc2OTg0NTAxfQ.x2MEHyHFBDWFlZe-LmF7xOlEntmT8O7gfxSJjAbkpus
```

### 4. 再デプロイ

環境変数設定後、再デプロイ：

```powershell
vercel --prod
```

### 完了！

URLが表示されます：
```
https://your-app.vercel.app
```

---

## 代替方法: Webインターフェース

CLIが面倒な場合：

1. **GitHubにアップロード**（Web経由）
   - https://github.com/new でリポジトリ作成
   - 「uploading an existing file」でファイルアップロード

2. **Vercelでインポート**
   - https://vercel.com
   - 「Add New Project」→ GitHubリポジトリを選択
   - 環境変数を設定してデプロイ


