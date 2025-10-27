import { supabase } from './supabase'

// 画像アップロード用のストレージバケット名
const BUCKET_NAME = 'post-images'

// 画像を圧縮・リサイズする関数（最適化版）
export async function compressImage(file: File, maxWidth: number = 1920, maxHeight: number = 1920, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // 画像のサイズを計算
        let width = img.width
        let height = img.height
        
        // アスペクト比を維持しながらリサイズ
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width
            width = maxWidth
          } else {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        // Canvasを使用してリサイズ・圧縮
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context is not available'))
          return
        }
        
        ctx.drawImage(img, 0, 0, width, height)
        
        // Blobに変換
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }
            
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            
            resolve(compressedFile)
          },
          file.type,
          quality
        )
      }
      
      img.onerror = reject
      img.src = e.target?.result as string
    }
    
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 画像をアップロードする関数（圧縮機能付き）
export async function uploadImage(file: File, userId: string): Promise<{ url: string } | { error: string }> {
  try {
    console.log('画像アップロード開始:', { fileName: file.name, userId, originalSize: file.size })
    
    // 画像を圧縮
    const compressedFile = await compressImage(file)
    console.log('画像圧縮完了:', { originalSize: file.size, compressedSize: compressedFile.size })
    
    // ファイル名を生成（ユーザーID + タイムスタンプ + 元のファイル名）
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    console.log('アップロードパス:', filePath)

    // Supabase Storageにアップロード
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: compressedFile.type
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { error: `画像のアップロードに失敗しました: ${uploadError.message}` }
    }

    // 公開URLを取得
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    console.log('画像アップロード成功:', data.publicUrl)
    return { url: data.publicUrl }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { error: '画像のアップロード中にエラーが発生しました' }
  }
}

// 画像を削除する関数
export async function deleteImage(imageUrl: string): Promise<{ error?: string }> {
  try {
    // URLからファイルパスを抽出
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const bucketIndex = pathParts.findIndex(part => part === BUCKET_NAME)
    
    if (bucketIndex === -1) {
      return { error: '無効な画像URLです' }
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/')

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return { error: '画像の削除に失敗しました' }
    }

    return {}
  } catch (error) {
    console.error('Error deleting image:', error)
    return { error: '画像の削除中にエラーが発生しました' }
  }
}

// 画像の最大サイズ（5MBに変更、アップロード時に圧縮）
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024

// 最大画像数
export const MAX_IMAGES_PER_POST = 5

// 許可される画像形式
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]

// 画像ファイルのバリデーション（軽量化）
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'JPEG、PNG、WebP形式の画像のみアップロード可能です'
    }
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: '画像サイズは2MB以下にしてください'
    }
  }

  return { valid: true }
}