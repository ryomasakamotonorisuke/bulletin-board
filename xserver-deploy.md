# Xserverデプロイ手順

## 1. 本番環境用の環境変数設定

`.env.production`ファイルを作成し、以下の内容を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=https://phbizanrnmjqtiybagzw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDg1MDEsImV4cCI6MjA3Njk4NDUwMX0.VPfLNw_a8SKt46Cb4Szb6MRLucVWo6UspW6V8ipCRqE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYml6YW5ybm1qcXRpeWJhZ3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQwODUwMSwiZXhwIjoyMDc2OTg0NTAxfQ.x2MEHyHFBDWFlZe-LmF7xOlEntmT8O7gfxSJjAbkpus
NEXT_PUBLIC_APP_URL=https://your-domain.xserver.jp
```

## 2. ビルド設定の更新

`next.config.ts`を本番用に更新：

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    serverComponentsExternalPackages: []
  }
};

export default nextConfig;
```

## 3. package.jsonの更新

```json
{
  "scripts": {
    "dev": "next dev -H localhost",
    "dev:local": "next dev -H 127.0.0.1",
    "build": "next build",
    "build:static": "next build && next export",
    "start": "next start -H localhost",
    "lint": "eslint"
  }
}
```

## 4. 静的ファイル生成

```bash
npm run build:static
```

## 5. Xserverへのアップロード

1. `out`フォルダの内容をXserverのドキュメントルートにアップロード
2. `.htaccess`ファイルを作成（必要に応じて）

## 6. データベース設定

SupabaseのSQL Editorで以下を実行：

```sql
-- 管理者機能用のデータベーススキーマ更新
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- その他の管理者機能用のSQL（supabase-admin-schema.sqlの内容）
```

## 7. ドメイン設定

Xserverの管理画面で：
1. ドメインを設定
2. SSL証明書を有効化
3. 環境変数の`NEXT_PUBLIC_APP_URL`を実際のドメインに更新

