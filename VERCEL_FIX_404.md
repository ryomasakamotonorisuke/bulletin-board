# 404エラー解決手順

## 現在の状況
- ✅ デプロイ成功（Ready状態）
- ❌ サイトにアクセスすると404エラー
- URL: https://bulletin-board-ftcov5qgt-ryomasakamotonorisukes-projects.vercel.app/

## 原因
デプロイは成功しているが、**環境変数がProduction環境に設定されていない**可能性が高いです。

## 解決手順

### ステップ1: 環境変数を確認

1. Vercelダッシュボードで左側のメニューから **「Settings」** をクリック
2. **「Environment Variables」** をクリック

### ステップ2: 3つの環境変数を確認

以下の3つが存在するか確認してください：

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY`

### ステップ3: Environment列を確認（重要！）

各環境変数の右側の「Environment」列で、以下を確認：

```
例：

Environment変数名    | Value                     | Environment
--------------------+---------------------------+------------------
NEXT_PUBLIC_SUPA...  | https://phbizanrnmjq...   | ☑️ Production
                                                      ☑️ Preview
                                                      ☑️ Development
```

**もしProductionにチェックが入っていない場合：**
→ これが404エラーの原因です！

### ステップ4: Environmentにチェックを追加（必要な場合）

1. 各環境変数の右側の **「Edit」** ボタンをクリック
2. 「Environment」で以下すべてにチェック：
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development
3. **「Save」** をクリック

### ステップ5: 再デプロイ

環境変数を変更した後は、必ず再デプロイが必要です：

1. 左側のメニューから **「Deployments」** をクリック
2. 最新のデプロイメント（2khWfbg7F）をクリック
3. 右上の「︙」（3つの点）メニューをクリック
4. **「Redeploy」** をクリック
5. 確認ダイアログで「Redeploy」をクリック

完了まで2-3分かかります。

### ステップ6: 再度アクセス

再デプロイ完了後、以下のURLにアクセス：
```
https://bulletin-board-ftcov5qgt-ryomasakamotonorisukes-projects.vercel.app/
```

ログインページが表示されれば成功です！

---

## 環境変数が存在しない場合

以下の手順で追加してください：

### 環境変数1: NEXT_PUBLIC_SUPABASE_URL

1. 「Add New」ボタンをクリック
2. 以下を入力：
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://phbizanrnmjqtiybagzw.supabase.co
   Environment: ☑️ Production ☑️ Preview ☑️ Development
   ```
3. 「Add」をクリック

### 環境変数2: NEXT_PUBLIC_SUPABASE_ANON_KEY

1. 「Add New」ボタンをクリック
2. 以下を入力：
   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDg1MDEsImV4cCI6MjA3Njk4NDUwMX0.VPfLNw_a8SKt46Cb4Szb6MRLucVWo6UspW6V8ipCRqE
   Environment: ☑️ Production ☑️ Preview ☑️ Development
   ```
3. 「Add」をクリック

### 環境変数3: SUPABASE_SERVICE_ROLE_KEY

1. 「Add New」ボタンをクリック
2. 以下を入力：
   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQwODUwMSwiZXhwIjoyMDc2OTg0NTAxfQ.x2MEHyHFBDWFlZe-LmF7xOlEntmT8O7gfxSJjAbkpus
   Environment: ☑️ Production ☑️ Preview ☑️ Development
   ```
3. 「Add」をクリック

すべて追加したら、必ずRedeployを実行してください。

---

## トラブルシューティング

### まだ404が出る場合

1. **ビルドログを確認**
   - Deployments → 最新のデプロイ → Build Logs
   - エラーメッセージを確認

2. **Functionsログを確認**
   - Deployments → 最新のデプロイ → Functions
   - 起動時のエラーを確認

3. **ブラウザのコンソールを確認**
   - F12キーを押して開発者ツールを開く
   - Consoleタブでエラーメッセージを確認

### プロジェクトを削除して再作成

問題が解決しない場合：

1. Settings → General → 一番下の「Delete Project」
2. 「Delete」をクリックして削除
3. 新しいプロジェクトを作成
4. 環境変数を設定
5. デプロイ

---

## 次のステップ

現在、以下を確認してください：

1. **Settings → Environment Variables** に移動
2. 3つの環境変数があるか確認
3. 各環境変数の「Environment」欄を確認
4. Productionにチェックが入っているか確認

結果を教えてください！

