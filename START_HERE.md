# 🚀 デプロイ開始ガイド

## 今すぐやること

### ステップ1: Gitをインストール

1. **ダウンロード**
   - https://git-scm.com/download/win
   - 表示されたページでダウンロードが自動開始

2. **インストール**
   - ダウンロードしたファイル（Git-2.x.x-64-bit.exe）を実行
   - 「Next」をクリック（デフォルト設定でOK）
   - インストール完了

3. **PowerShellを再起動**
   - 現在のPowerShellを閉じる
   - 新しいPowerShellを開く
   - 確認: `git --version`

### ステップ2: 作業を開始

PowerShellで：

```powershell
# 1. ディレクトリに移動
cd C:\Users\yuhei\Desktop\00000\bulletin-board

# 2. ユーザー設定
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 3. GitHubアカウント作成（まだの場合）
# https://github.com にアクセス

# 4. リポジトリを初期化
git init
git add .
git commit -m "Initial commit"

# 5. GitHubでリポジトリを作成
# https://github.com/new
# 名前: bulletin-board
# Create repository

# 6. GitHubにプッシュ
git remote add origin https://github.com/ユーザー名/bulletin-board.git
git branch -M main
git push -u origin main
```

### ステップ3: Vercelでデプロイ

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン
3. 「Add New Project」→ リポジトリ選択
4. 環境変数を設定（`SETUP_FOR_VERCEL.md`参照）
5. 「Deploy」クリック

### 完了！

URLが表示されます。クリックしてアプリを確認！

---

## 詳細手順

- **Gitインストール詳細**: `INSTALL_GIT.md`
- **Vercelデプロイ詳細**: `SETUP_FOR_VERCEL.md`

---

## サポート

エラーが出たら教えてください。一緒に解決します！



