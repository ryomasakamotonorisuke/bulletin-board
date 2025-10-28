# page.tsx の手動修正が必要です

## 修正が必要な箇所

`src/app/page.tsx` の19行目と102-106行目を手動で修正してください。

### 1. 19行目を修正

```typescript
// 変更前
const { user, loading: authLoading, requiresPasswordChange } = useAuth()

// 変更後
const { user, loading: authLoading } = useAuth()
```

### 2. 102-106行目を削除

```typescript
  }

  // 初回ログイン時パスワード変更を強制
  if (requiresPasswordChange) {
    return <PasswordChangeRequired />
  }

  return (
```

この部分全体を削除してください。

## 完了後

```bash
npm run build
git add src/app/page.tsx
git commit -m "fix: page.tsx修正"
git push
```

## 機能の使い方

- ヘッダーのユーザーメニューから「アカウント設定」をクリック
- パスワード変更フォームで変更

