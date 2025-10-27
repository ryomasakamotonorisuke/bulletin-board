# 画像表示のデバッグ

## 問題
画像が黒く表示される

## 考えられる原因

1. **Supabaseストレージの設定**
   - バケットが公開設定になっていない
   - CORS設定の問題
   - URLが正しく生成されていない

2. **画像の圧縮・アップロード**
   - 圧縮処理でエラーが発生
   - アップロードが失敗している

## 確認方法

1. ブラウザのコンソールで画像URLを確認
2. Supabaseのダッシュボードで画像がアップロードされているか確認
3. 画像URLに直接アクセスして表示されるか確認

## 修正案

`supabase-enhanced-schema.sql`のストレージポリシーを確認し、以下を実行：

```sql
-- ストレージバケットが存在するか確認
SELECT * FROM storage.buckets WHERE name = 'post-images';

-- ストレージポリシーを確認
SELECT * FROM storage.policies WHERE bucket_id = 'post-images';

-- 新しい公開ポリシーを作成（既に存在する場合は削除してから）
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');
```

## 画像アップロード時のURL確認

現在、画像は`compressImage`関数で圧縮され、`uploadImage`でアップロードされています。

問題が続く場合は、以下を確認：
- 画像ファイルが正しく選択されているか
- 圧縮処理が正常に完了しているか
- Supabase Storageに画像が保存されているか

