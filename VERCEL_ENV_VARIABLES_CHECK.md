# Vercel環境変数確認ガイド

## 404エラーを解決する手順

### ステップ1: 環境変数ページに移動

現在「Deployment Settings」ページにいます。

1. 左側のメニューから **「Settings」** をクリック
2. 下の項目から **「Environment Variables」** をクリック

または、ブラウザのアドレスバーで以下にアクセス：
```
https://vercel.com/[あなたのユーザー名]/bulletin-board/settings/environment-variables
```

### ステップ2: 環境変数を確認

以下の3つの環境変数が存在するか確認してください：

| 環境変数名 | 値 |
|-----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://phbizanrnmjqtiybagzw.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### ステップ3: Environmentの設定を確認

**重要：** 各環境変数の右側に「Environment」欄があります。

以下の3つすべてにチェックが入っていることを確認：
- ☑️ **Production**
- ☑️ **Preview**
- ☑️ **Development**

**もしチェックが入っていない場合：**
1. 該当する環境変数の右側の「Edit」ボタンをクリック
2. チェックボックスで必要な環境を選択
3. 「Save」をクリック

### ステップ4: 環境変数を追加（まだ存在しない場合）

1. 「Add New」または「＋」ボタンをクリック
2. 各環境変数を1つずつ追加：

#### 環境変数1
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://phbizanrnmjqtiybagzw.supabase.co
Environment: Production, Preview, Development すべてにチェック
```

#### 環境変数2
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDg1MDEsImV4cCI6MjA3Njk4NDUwMX0.VPfLNw_a8SKt46Cb4Szb6MRLucVWo6UspW6V8ipCRqE
Environment: Production, Preview, Development すべてにチェック
```

#### 環境変数3
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQwODUwMSwiZXhwIjoyMDc2OTg0NTAxfQ.x2MEHyHFBDWFlZe-LmF7xOlEntmT8O7gfxSJjAbkpus
Environment: Production, Preview, Development すべてにチェック
```

### ステップ5: 再デプロイ

環境変数を追加/変更した後は、**必ず再デプロイ**が必要です：

1. 左側のメニューから **「Deployments」** をクリック
2. 最新のデプロイを選択
3. 右上の「Redeploy」ボタンをクリック
4. 確認ダイアログで「Redeploy」をクリック

完了まで2-3分かかります。

## よくある問題

### 環境変数が設定されているのに404が出る
→ Environment欄の**Production**にチェックが入っているか確認してください。

### ビルドは成功するが404が出る
→ ブラウザのキャッシュをクリア（Ctrl+Shift+R）して再度アクセス。

### 画像やアセットが表示されない
→ Supabase Storageのポリシーを確認してください。

## トラブルシューティング

### まだ404が出る場合

1. **ビルドログを確認**
   - Deployments → 最新のデプロイ → Build Logs
   - エラーメッセージを確認

2. **Functions Logsを確認**
   - Deployments → 最新のデプロイ → Functions
   - 起動時のエラーを確認

3. **ブラウザのコンソールを確認**
   - F12キーを押して開発者ツールを開く
   - Consoleタブでエラーメッセージを確認

4. **プロジェクトを削除して再作成**
   - Settings → General → 一番下の「Delete Project」
   - 削除後、再度インポート

## 次のステップ

環境変数を正しく設定し、再デプロイが完了したら：
1. 再度アプリにアクセス
2. ログインページが表示されるか確認
3. 新規登録を試してみる

