# 開発サーバーの再起動手順

## 問題

ログイン処理が「Sending login request...」から進まない

## 解決方法

### 手順1: 実行中のNode.jsプロセスを終了

1. 現在のターミナルで **Ctrl+C** を押す
2. もしプロセスが終了しない場合、以下を実行：

```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
```

### 手順2: キャッシュをクリア

```powershell
cd C:\Users\yuhei\Desktop\00000\bulletin-board
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
```

### 手順3: 開発サーバーを再起動

```powershell
npm run dev
```

### 手順4: ブラウザをリロード

1. **Ctrl+Shift+R** でハードリフレッシュ（キャッシュクリア）
2. または **F12 → Application → Clear Storage → Clear site data**

### 手順5: ログインを試行

再度ログインを試して、以下のログを確認：

- `📥 Response received`
- `response.error:` 
- `response.data:`

## トラブルシューティング

### まだ進まない場合

考えられる原因：
1. ネットワーク問題
2. Supabaseのレート制限
3. ブラウザの拡張機能
4. CORSの問題

### 確認事項

1. 別のブラウザで試す（Chrome、Edge、Firefoxなど）
2. シークレットモードで試す
3. ネットワークタブで実際のリクエスト/レスポンスを確認

