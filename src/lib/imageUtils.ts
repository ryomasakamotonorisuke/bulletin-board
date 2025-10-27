// 画像ユーティリティ関数

/**
 * 画像を最適なサイズにリサイズ・圧縮
 * @param file 元の画像ファイル
 * @param maxWidth 最大幅
 * @param maxHeight 最大高さ
 * @param quality 圧縮品質（0.6-0.8推奨）
 * @returns 圧縮されたFileオブジェクト
 */
export async function compressImage(
  file: File, 
  maxWidth: number = 1920, 
  maxHeight: number = 1920, 
  quality: number = 0.75
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // 画像のサイズを計算（アスペクト比を維持）
        let width = img.width
        let height = img.height
        
        // リサイズが必要かチェック
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height
          
          if (width > height) {
            width = maxWidth
            height = Math.round(maxWidth / aspectRatio)
          } else {
            height = maxHeight
            width = Math.round(maxHeight * aspectRatio)
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
        
        // 高品質なリサンプリング
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        
        ctx.drawImage(img, 0, 0, width, height)
        
        // Blobに変換（JPEGまたは元の形式）
        const outputFormat = file.type === 'image/png' ? 'image/jpeg' : file.type
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }
            
            const compressedFile = new File([blob], file.name, {
              type: outputFormat,
              lastModified: Date.now()
            })
            
            console.log(`画像圧縮: ${file.size} -> ${compressedFile.size} bytes (${Math.round(compressedFile.size / file.size * 100)}%)`)
            resolve(compressedFile)
          },
          outputFormat,
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

/**
 * 複数の画像を一度に圧縮
 */
export async function compressMultipleImages(files: File[]): Promise<File[]> {
  return Promise.all(files.map(file => compressImage(file)))
}

/**
 * 画像プレビューURLを生成
 */
export function createPreviewUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

