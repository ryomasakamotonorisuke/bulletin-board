# デバッグ手順

## 現在の状況

- ローカル開発サーバー: http://localhost:3001
- デプロイ中: https://bulletin-board-omega-nine.vercel.app/

## ログイン確認手順

### 1. ブラウザで確認
1. http://localhost:3001 にアクセス
2. F12キーで開発者ツールを開く
3. Consoleタブを選択
4. ログインを試行

### 2. コンソールに表示されるログ
- `Sign in attempt: admin@admin.com` ← これは表示されている
- `Login successful, data: ...` ← 成功した場合
- `Login error: ...` ← エラーの場合
- `Session: ...` ← セッション情報

### 3. 次のログが表示されない場合

「Login successful」が表示されない場合、ログイン処理が途中で止まっています。

#### 考えられる原因
1. 認証情報が間違っている（400エラー）
2. ネットワークエラー
3. セッション処理でエラー

### 4. 確認すべきこと

Supabaseでユーザーを確認してください：

```sql
SELECT 
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;
```

結果を確認して、`admin@admin.com`のユーザーが存在するか確認してください。

### 5. ログインテスト用SQL

```sql
-- 全てのユーザーを確認
SELECT 
  u.email,
  u.id,
  p.is_admin,
  p.is_active
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

## 次のステップ

1. ブラウザのコンソールでログを確認
2. 「Login error」が表示されるか確認
3. エラーメッセージの内容を教えてください

## トラブルシューティング

### もし「Login successful」が表示されたら
- ログインは成功しています
- その後の画面遷移で問題がある可能性があります

### もし「Login error」が表示されたら
- エラーメッセージの内容を教えてください
- 認証情報を確認してください

### もし何も表示されない場合
- ページをリロード（F5キー）
- ブラウザのキャッシュをクリア
- もう一度ログインを試行

