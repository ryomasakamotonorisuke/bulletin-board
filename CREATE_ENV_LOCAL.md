# .env.local ファイルの作成方法

## 問題

「Calling signInWithPassword...」から進まない原因は、`.env.local`ファイルが存在しない可能性があります。

## 解決方法

### プロジェクトルートに .env.local を作成

以下の内容でファイルを作成してください：

```
NEXT_PUBLIC_SUPABASE_URL=https://phbizanrnmjqtiybagzw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDg1MDEsImV4cCI6MjA3Njk4NDUwMX0.VPfLNw_a8SKt46Cb4Szb6MRLucVWo6UspW6V8ipCRqE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImiYXQiOjE3NjE0MDg1MDEsImV4cCI6MjA3Njk4NDUwMX0.x2MEHyHFBDWFlZe-LmF7xOlEntmT8O7gfxSJjAbkpus
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### ファイルの作成場所

プロジェクトのルートディレクトリ：
```
bulletin-board/
  ├── .env.local  ← ここに作成
  ├── src/
  ├── public/
  └── ...
```

### 確認方法

1. `.env.local`ファイルを作成
2. 開発サーバーを再起動（Ctrl+C で停止後、`npm run dev`）
3. ブラウザをリロード（F5）
4. ログインを試行
5. コンソールで環境変数が表示されることを確認

## 次回以降

`.env.local`は既に`.gitignore`に含まれているため、Gitにコミットされません。
このファイルは各環境で作成してください。

