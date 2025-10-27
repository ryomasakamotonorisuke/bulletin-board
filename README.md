# 社内掲示板アプリ

Supabase + Next.js + Tailwind CSS で構築されたモダンな掲示板アプリケーションです。

## 主な機能

- 📝 投稿の作成・編集・削除
- 🖼️ 複数画像のアップロード（最大5枚）
- ❤️ いいね機能
- 💬 コメント機能
- 👤 ユーザー管理
- 🛡️ 管理者機能
- 🎨 近未来デザイン

## 技術スタック

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **言語**: TypeScript

## セットアップ

1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定
`.env.local`ファイルを作成し、以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. 開発サーバーの起動
```bash
npm run dev
```

## デプロイ

### Vercel（推奨）

1. GitHubにリポジトリをプッシュ
2. Vercel（https://vercel.com）にアクセス
3. GitHubリポジトリを接続
4. 環境変数を設定
5. デプロイ

### Xserver

静的エクスポートモードでビルド：

```bash
npm run build
```

`out`フォルダの内容をXserverの`public_html`にアップロード

## ライセンス

Private
