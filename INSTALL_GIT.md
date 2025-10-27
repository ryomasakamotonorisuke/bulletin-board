# Gitインストール手順

## 方法1: Git for Windowsをダウンロード

1. **公式サイトからダウンロード**
   - https://git-scm.com/download/win
   - 「Download for Windows」をクリック

2. **インストール**
   - ダウンロードしたインストーラーを実行
   - オプションはそのまま「Next」でOK
   - インストール完了後、PowerShellを再起動

3. **確認**
```powershell
git --version
```

## 方法2: wingetを使用（Windows 10/11）

PowerShellを管理者として実行：

```powershell
winget install --id Git.Git -e --source winget
```

再起動後：

```powershell
git --version
```

## インストール後の設定

### 1. 基本設定

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. デフォルトブランチ名設定

```powershell
git config --global init.defaultBranch main
```

## 次のステップ

Gitインストール後：

1. **GitHubアカウント作成**（まだの場合）
   - https://github.com

2. **リポジトリを作成**
   - GitHubで「New repository」
   - 名前: `bulletin-board`
   - Public or Private

3. **デプロイ手順**
   - `SETUP_FOR_VERCEL.md` を参照


