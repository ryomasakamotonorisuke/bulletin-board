'use client'

import { useState } from 'react'
import { usePosts } from '@/hooks/usePosts'
import { validateImageFile, MAX_IMAGES_PER_POST, compressImage } from '@/lib/storage'
import { ImageIcon, X } from 'lucide-react'

interface PostFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: {
    id: string
    title: string
    content: string
    image_url?: string
  }
  isEditing?: boolean
  postType?: 'user' | 'store'
}

export default function PostForm({ onSuccess, onCancel, initialData, isEditing = false, postType = 'user' }: PostFormProps) {
  console.log('PostForm rendered with postType:', postType)
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.image_url ? [initialData.image_url] : [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { createPost, updatePost } = usePosts()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // 最大5枚まで
    const totalFiles = imageFiles.length + files.length
    if (totalFiles > MAX_IMAGES_PER_POST) {
      setError(`画像は最大${MAX_IMAGES_PER_POST}枚まで添付できます`)
      return
    }

    // バリデーション
    for (const file of files) {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setError(validation.error!)
        return
      }
    }

    // 画像を追加
    setImageFiles([...imageFiles, ...files])
    setError('')

    // プレビュー用のURLを作成
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles(files => files.filter((_, i) => i !== index))
    setImagePreviews(previews => previews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('タイトルを入力してください')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 画像を圧縮してからアップロード
      const compressedFiles = imageFiles.length > 0 
        ? await Promise.all(imageFiles.map(file => compressImage(file)))
        : []
      
      const postData: any = {
        title: title.trim(),
        content: content.trim() || undefined,
        image_files: compressedFiles.length > 0 ? compressedFiles : undefined,
      }

      let result
      if (isEditing && initialData) {
        result = await updatePost(initialData.id, postData)
      } else {
        result = await createPost(postData)
      }

      if (result.error) {
        // エラーメッセージを詳細に
        console.error('投稿作成エラー:', result.error)
        let errorMsg = typeof result.error === 'string' ? result.error : String(result.error)
        
        // エラーメッセージをわかりやすく変換
        if (errorMsg.includes('Row Level Security')) {
          errorMsg = '権限がありません。管理者にお問い合わせください。'
        } else if (errorMsg.includes('image_urls')) {
          errorMsg = 'データベースにimage_urlsカラムを追加するか、単一画像アップロードをご利用ください'
        } else if (errorMsg.includes('column') && errorMsg.includes('post_type')) {
          errorMsg = 'データベースのpost_typeカラムが追加されていません'
        } else if (errorMsg.includes('permission denied') || errorMsg.includes('403')) {
          errorMsg = '投稿する権限がありません。管理者にお問い合わせください。'
        }
        
        setError(errorMsg)
      } else {
        // フォームをリセット
        setTitle('')
        setContent('')
        setImageFiles([])
        setImagePreviews([])
        
        console.log('✅ 投稿が正常に作成されました')
        
        // 成功メッセージを表示
        alert('投稿が正常に作成されました！')
        
        // onSuccess を呼び出してフォームを閉じる
        onSuccess?.()
      }
    } catch (err) {
      setError('予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 japanese">
        {isEditing 
          ? '投稿を編集' 
          : postType === 'store' 
            ? '新しい店舗投稿' 
            : '新しい投稿'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            タイトル *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="投稿のタイトルを入力してください"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            内容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="投稿の内容を入力してください（任意）"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            画像
          </label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="image"
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              画像を選択
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <span className="text-xs text-gray-500 japanese">
              {imageFiles.length}/{MAX_IMAGES_PER_POST}枚
            </span>
          </div>
          
          {imagePreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div 
                  key={index}
                  className="relative rounded-2xl overflow-hidden group"
                  style={{ 
                    aspectRatio: '1',
                    background: 'linear-gradient(135deg, rgba(255, 199, 0, 0.1) 0%, rgba(246, 145, 17, 0.1) 100%)',
                    padding: '8px'
                  }}
                >
                  <img
                    src={preview}
                    alt={`プレビュー${index + 1}`}
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              キャンセル
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? '保存中...' : isEditing ? '更新' : '投稿'}
          </button>
        </div>
      </form>
    </div>
  )
}

