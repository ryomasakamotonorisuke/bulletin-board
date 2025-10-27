# 🚀 Gitなしでデプロイする方法

## 方法1: Vercel CLI（最も簡単）

### ステップ1: Vercel CLIをインストール

```powershell
# PowerShellを管理者として実行
npm install -g vercel
```

### ステップ2: Vercelにログイン

```powershell
cd bulletin-board
vercel login
```

ブラウザが開くので、GitHubアカウントでログイン

### ステップ3: プロジェクトをデプロイ

```powershell
vercel
```

以下の質問に答えます：
- Set up and deploy "bulletin-board"? → **Y**
- Which scope? → デフォルトでOK
- Link to existing project? → **N**
- What's your project's name? → デフォルトでOK
- In which directory is your code located? → `./`

### ステップ4: 環境変数を設定

```powershell
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

それぞれの環境変数の値を入力

### ステップ5: 本番環境にデプロイ

```powershell
vercel --prod
```

### 完了！
URLが表示されます。例: `https://bulletin-board-xxxxx.vercel.app`

---

## 方法2: GitHub Webインターフェース（Git不要）

1. **GitHubにリポジトリを作成**
   - https://github.com/new
   - リポジトリ名を入力して「Create repository」

2. **ファイルをアップロード**
   - GitHubリポジトリページで「uploading an existing file」をクリック
   - `bulletin-board`フォルダのファイルをドラッグ&ドロップ
   - 「Commit changes」をクリック

3. **Vercelでデプロイ**
   - https://vercel.com にアクセス
   - GitHubアカウントでログイン
   - 「Add New Project」
   - 作成したリポジトリを選択
   - 環境変数を設定してデプロイ

---

## 方法3: Vercel GitHub App（推奨）

1. **GitHub Desktopをインストール**（GUIツール）
   - https://desktop.github.com/
   - インストール後、GitHubアカウントでログイン

2. **リポジトリを公開**
   - GitHub Desktopで「Publish repository」
   - リポジトリがGitHubに作成されます

3. **Vercelでデプロイ**
   - Vercelからリポジトリをインポート
   - 自動でデプロイされます



