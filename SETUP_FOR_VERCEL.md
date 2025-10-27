# Vercelデプロイ完全ガイド

## 🗑️ Vercelを一旦空にして最初から始める

既存のプロジェクトを削除して、完全に最初からやり直したい場合：

### ステップ1：既存のVercelプロジェクトを削除

1. **https://vercel.com** にアクセスしてログイン
2. ダッシュボードで「bulletin-board」プロジェクトを選択
3. プロジェクトページで「Settings」タブをクリック
4. 一番下までスクロール
5. 「Delete Project」セクションを見つける
6. 「Delete」ボタンをクリック
7. 確認ダイアログでプロジェクト名を入力
8. 「Delete」をクリック

**⚠️ 注意：** これでプロジェクトが完全に削除されます。URLも使用できなくなります。

### ステップ2：クリーンスタート

削除が完了したら、下記の「🚀 クイックスタート」手順に従って、新しいプロジェクトを作成してください。

---

## 🚀 クイックスタート：1からデプロイする

既存のコードを再度デプロイする場合の最短手順です。

### 準備：GitHubリポジトリにコードをプッシュ

```powershell
# プロジェクトディレクトリに移動
cd C:\Users\yuhei\Desktop\00000\bulletin-board

# Git初期化（初回のみ）
git init

# GitHubリポジトリを追加（既にある場合はスキップ）
git remote add origin https://github.com/ryomasakamotonorisuke/bulletin-board.git

# 変更をコミット
git add .
git commit -m "Update for Vercel deployment"

# GitHubにプッシュ
git push -u origin main
```

### Vercelでデプロイ

1. **https://vercel.com** にアクセスしてログイン
2. 「Add New Project」をクリック
3. `bulletin-board` リポジトリを選択して「Import」
4. 環境変数を**3つ**追加：

| 環境変数名 | 値 |
|-----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://phbizanrnmjqtiybagzw.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDg1MDEsImV4cCI6MjA3Njk4NDUwMX0.VPfLNw_a8SKt46Cb4Szb6MRLucVWo6UspW6V8ipCRqE` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQwODUwMSwiZXhwIjoyMDc2OTg0NTAxfQ.x2MEHyHFBDWFlZe-LmF7xOlEntmT8O7gfxSJjAbkpus` |

5. 「Production」「Preview」「Development」すべてにチェック
6. 各環境変数を追加したら「Add」ボタンをクリック
7. すべての環境変数を追加したら「Deploy」をクリック
8. 完了後、URLをクリックしてサイトを確認！

---

## 📋 既存のプロジェクトを再デプロイする場合

プロジェクトが既に存在する場合は、こちらが簡単です。

### 方法1：既存プロジェクトで再デプロイ（推奨）

1. **https://vercel.com** にアクセスしてログイン
2. 「bulletin-board」プロジェクトを選択
3. 「Deployments」タブを開く
4. 右上の「Redeploy」ボタンをクリック
5. 「Redeploy」をクリック
6. 完了まで待つ（1-2分）

### 方法2：環境変数を確認してから再デプロイ

1. 「Settings」→「Environment Variables」を開く
2. 以下の3つが揃っているか確認：
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY`
3. 揃っていない場合は追加
4. 「Deployments」タブで「Redeploy」をクリック

### 方法3：プロジェクトを削除して再作成

トラブルが解決しない場合、プロジェクトを削除して最初からやり直します：

1. 「Settings」→「General」→ 一番下までスクロール
2. 「Delete Project」セクションで「Delete」をクリック
3. 確認ダイアログでプロジェクト名を入力して削除
4. ファイルの冒頭の「🗑️ Vercelを一旦空にして最初から始める」セクションを参照

---

## 必要なもの
- ✅ Git（インストール済み）
- ✅ GitHubアカウント
- ✅ Vercelアカウント（無料）

## ステップ1: GitHubリポジトリを作成

1. **https://github.com** にアクセス
2. 「New repository」をクリック
3. 設定：
   - Repository name: `bulletin-board`
   - Description: `社内掲示板アプリ`
   - Public または Private
   - 「Initialize this repository with a README」は**チェックしない**
4. 「Create repository」をクリック

## ステップ2: コードをプッシュ

PowerShellで：

```powershell
# ディレクトリに移動
cd C:\Users\yuhei\Desktop\00000\bulletin-board

# Git初期化
git init

# すべてのファイルを追加
git add .

# コミット
git commit -m "Initial commit"

# GitHubリポジトリを追加
git remote add origin https://github.com/ryomasakamotonorisuke/bulletin-board.git

# プッシュ
git push -u origin main
```

GitHubのユーザー名とパスワード（Personal Access Token）を求められたら入力

### Personal Access Token作成方法

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. 「Generate new token (classic)」
4. スコープ: `repo` をチェック
5. 「Generate token」
6. 表示されたトークンをコピー（一度しか表示されないので注意）

## ステップ3: Vercelでデプロイ

### 3-1. Vercelにサインアップ

1. **https://vercel.com** にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択（GitHubアカウントでログイン）
4. GitHubの認証を許可

### 3-2. プロジェクトの作成

1. ダッシュボードで「Add New Project」をクリック
2. 「Import Git Repository」で `bulletin-board` を選択（表示されない場合は「Configure GitHub App」からアクセス権限を設定）
3. 「Import」をクリック

### 3-3. 環境変数の設定（重要！）

プロジェクト設定画面で、以下の環境変数を追加します：

**手順：**
1. 「Environment Variables」セクションまでスクロール
2. 「Environment Variables」の「Add」をクリック
3. 以下の3つを**1つずつ**追加：

#### 環境変数1: `NEXT_PUBLIC_SUPABASE_URL`
```
名前: NEXT_PUBLIC_SUPABASE_URL
値: https://phbizanrnmjqtiybagzw.supabase.co
```
- 「Add」をクリック
- Environment: **Production, Preview, Development** すべてを選択
- 「Add」をクリック

#### 環境変数2: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
```
名前: NEXT_PUBLIC_SUPABASE_ANON_KEY
値: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDg1MDEsImV4cCI6MjA3Njk4NDUwMX0.VPfLNw_a8SKt46Cb4Szb6MRLucVWo6UspW6V8ipCRqE
```
- 「Add」をクリック
- Environment: **Production, Preview, Development** すべてを選択
- 「Add」をクリック

#### 環境変数3: `SUPABASE_SERVICE_ROLE_KEY`
```
名前: SUPABASE_SERVICE_ROLE_KEY
値: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQwODUwMSwiZXhwIjoyMDc2OTg0NTAxfQ.x2MEHyHFBDWFlZe-LmF7xOlEntmT8O7gfxSJjAbkpus
```
- 「Add」をクリック
- Environment: **Production, Preview, Development** すべてを選択
- 「Add」をクリック

**⚠️ 重要：**
- 各環境変数で必ず **"Add"** をクリック（入力だけでは保存されません）
- 3つすべての環境変数を追加するまで次のステップに進まないでください
- 環境変数の**名前（キー）**は正確に入力してください（コピペ推奨）

### 3-4. デプロイ

1. すべての環境変数を設定したことを確認
2. 画面下部の「Deploy」ボタンをクリック
3. ビルドが開始されます（30秒～2分）

## ステップ4: 完了！

### 4-1. デプロイ確認

2-3分後にデプロイが完了します：
- 画面中央に「Building」→「Ready」と表示されます
- 緑色のチェックマークが表示されたら成功です

### 4-2. アプリにアクセス

デプロイ完了後、以下のようなURLが表示されます：
```
https://bulletin-board-xxxxx.vercel.app
```

このURLをクリックしてアプリにアクセスできます！

#### サイトのURLを確認する方法

**方法1：デプロイ完了画面から**
- デプロイが完了すると、画面中央にURLが表示されます
- 「Visit」ボタンをクリックするとサイトが開きます

**方法2：Vercelダッシュボードから**
1. https://vercel.com にアクセス
2. ダッシュボードで「bulletin-board」プロジェクトを選択
3. プロジェクトページの**右上**に表示されているURLをコピー
   - 形式：`https://bulletin-board-xxxxx.vercel.app`
4. このURLをクリックするとサイトが開きます

**方法3：最新のデプロイメントから**
1. プロジェクトページで「Deployments」タブを選択
2. 最新（一番上）のデプロイメントをクリック
3. 画面右上の「Visit」ボタンをクリック

**✅ 動作確認：**
- トップページが表示される
- ログイン/新規登録ができる
- 投稿を作成できる

**📌 メモ：**
サイトのURLはいつでもアクセスできます。メモしておくと便利です！

### 4-3. カスタムドメインの設定（オプション）

1. Vercelのプロジェクトページで「Settings」→「Domains」
2. お好みのドメインを入力
3. DNS設定を案内に従って設定

## 今後の更新

コードを更新してGitHubにプッシュすると、自動でデプロイされます：

```powershell
git add .
git commit -m "Update message"
git push
```

## トラブルシューティング

### Git関連エラー

#### エラー: `git is not recognized`
**症状：** PowerShellで git コマンドが認識されない

**解決方法：**
1. [Git公式サイト](https://git-scm.com/download/win)からダウンロード
2. インストール中はすべてデフォルト設定でOK
3. PowerShellを閉じて再起動
4. `git --version` で確認

### GitHub関連エラー

#### エラー: `Authentication failed`
**症状：** `git push` で認証に失敗する

**解決方法：**
1. Personal Access Tokenを再作成（上記参照）
2. パスワード入力時は**Personal Access Token**を入力（GitHubのパスワードではない）
3. トークンは1度しか表示されないので、安全な場所に保存

#### エラー: `It : パラメーター 'test' の引数変換を処理できません`
**症状：** PowerShellで `it remote add origin` のようなエラーが表示される

**原因：** コマンドの最初の文字が欠けている（例：`git` → `it`）

**解決方法：**
1. コマンドを完全に入力し直す：
   ```powershell
   git remote add origin https://github.com/ryomasakamotonorisuke/bulletin-board.git
   ```
2. または、1行ずつコピペして実行する
3. PowerShellでコマンドを実行する際は、**最初の `g` を含めて** すべての文字を正しく入力

**注意：** PowerShellでは `it` という別のコマンドが存在するため、`git` の最初の文字が欠けるとエラーになります

#### エラー: `error: failed to push some refs to 'https://github.com/...'`
**症状：** `git push` でプッシュに失敗する

**原因：** リモートリポジトリとローカルリポジトリの履歴が一致していない

**解決方法（選択肢1）：リモートの変更を取り込む（推奨）**
```powershell
# リモートの変更を取得してマージ
git pull origin main --allow-unrelated-histories

# プッシュ
git push -u origin main
```

**解決方法（選択肢2）：強制プッシュ（⚠️ 注意）**
リモートリポジトリが空の場合や、リモートの履歴を無視したい場合：
```powershell
# 強制プッシュ（リモートの履歴を上書き）
git push -u origin main --force
```

**⚠️ 注意：** `--force` オプションは、リモートの履歴を完全に上書きします。他の人が作業している場合は使用しないでください。

**解決方法（選択肢3）：リモートリポジトリを削除して再作成**
1. GitHubでリポジトリを削除
2. 新しいリポジトリを作成
3. プッシュコマンドを再実行

#### エラー: `remote origin already exists`
**症状：** `git remote add origin` でエラー

**解決方法：**
```powershell
# 既存のoriginを削除
git remote remove origin

# 新しく追加
git remote add origin https://github.com/ryomasakamotonorisuke/bulletin-board.git
```

#### エラー: `The provided GitHub repository does not contain the requested branch or commit reference`
**症状：** Vercelでリポジトリをインポートしようとすると、このエラーが表示される

**原因：** GitHubリポジトリが空であるか、正しくプッシュされていない

**解決方法：**
1. まず、GitHubリポジトリにコードが正しくプッシュされているか確認：
   ```powershell
   # プロジェクトディレクトリに移動
   cd C:\Users\yuhei\Desktop\00000\bulletin-board
   
   # Gitの状態を確認
   git status
   
   # リポジトリの状態を確認
   git remote -v
   ```
2. 変更があればコミットしてプッシュ：
   ```powershell
   git add .
   git commit -m "Initial commit or Update"
   git push -u origin main
   ```
3. GitHubのリポジトリページ（https://github.com/ryomasakamotonorisuke/bulletin-board）を確認
   - ファイルが表示されているか確認
   - 空の場合は、上記のプッシュコマンドを実行
4. コードが正しくプッシュされたら、Vercelで再度インポート

**GitHubリポジトリが本当に空の場合：**
```powershell
# プロジェクトディレクトリに移動
cd C:\Users\yuhei\Desktop\00000\bulletin-board

# .gitディレクトリがあるか確認
dir .git

# ない場合はGit初期化
git init

# すべてのファイルを追加
git add .

# コミット
git commit -m "Initial commit"

# リモートリポジトリを追加
git remote add origin https://github.com/ryomasakamotonorisuke/bulletin-board.git

# メインブランチを設定
git branch -M main

# プッシュ（初回）
git push -u origin main
```

### Vercel関連エラー

#### エラー: `No Production Deployment` / `Your Production Domain is not serving traffic`
**症状：** プロジェクトページに「No Production Deployment」と表示される

**原因：** プロジェクトは存在するが、デプロイが完了していない

**解決方法：**
1. Vercelダッシュボードで「bulletin-board」プロジェクトを選択
2. 「Deployments」タブを開く
3. デプロイ一覧を確認：
   - **デプロイがない場合** → GitHubリポジトリをインポート
   - **失敗したデプロイがある場合** → 手順4へ
4. 「Deployments」タブで右上の「Redeploy」または「Deploy」をクリック
5. 環境変数が設定されているか確認（「Settings」→「Environment Variables」）
6. 環境変数がなければ、以下を追加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
7. 再度「Deploy」をクリック

**まだ解決しない場合：**
1. プロジェクトを削除して再作成
2. または、GitHubリポジトリから再インポート

#### エラー: `Project "bulletin-board" already exists, please use a new name`
**症状：** プロジェクトをインポートする際にエラーが表示される

**解決方法（選択肢1）：既存のプロジェクトを使用**
1. Vercelのダッシュボードで「bulletin-board」プロジェクトを確認
2. 既にプロジェクトが存在する場合は、そのプロジェクトを選択
3. 「Settings」→「Environment Variables」で環境変数を設定
4. 「Deployments」タブで新しいデプロイを開始

**解決方法（選択肢2）：削除して再作成**
1. 既存の「bulletin-board」プロジェクトを選択
2. 「Settings」→「General」→ 一番下の「Delete」
3. 再度インポート手順を実行

**解決方法（選択肢3）：別の名前を使用**
1. プロジェクトインポート画面で「Project Name」を変更
   - 例：`bulletin-board-v2`、`my-bulletin-board` など
2. プロジェクト名は自由に変更可能（URLも変わります）
3. 例：`bulletin-board-v2` → URLは `https://bulletin-board-v2.vercel.app`

#### ビルドエラー
**症状：** デプロイ中に赤いエラー表示

**解決方法：**
1. Vercelのプロジェクトページで「Deployments」をクリック
2. 失敗したデプロイを選択
3. 「Build Logs」を確認
4. よくある原因：
   - 環境変数が設定されていない → **設定を再確認**
   - TypeScriptエラー → `npm run build` をローカルで実行して確認
   - 依存関係の問題 → `node_modules` がコミットされていないか確認

#### 環境変数が反映されない
**症状：** アプリが Supabase に接続できない

**解決方法：**
1. Vercelのプロジェクトページで「Settings」→「Environment Variables」
2. 3つの環境変数がすべて存在するか確認
3. 存在しない場合は追加
4. 存在する場合は、値が正しいか確認（コピペミスがないか）
5. 環境変数を追加/変更した後は、**「Redeploy」**を実行

#### 画像が表示されない
**症状：** 投稿した画像が表示されない

**解決方法：**
1. Supabaseダッシュボードで Storage を確認
2. Storageポリシーが正しく設定されているか確認
3. 画像URLが正しい形式か確認

#### ログインできない
**症状：** ログインフォームでエラー

**解決方法：**
1. Vercelの環境変数を再確認
2. Supabaseの認証設定を確認
3. ブラウザのコンソール（F12）でエラーメッセージを確認


