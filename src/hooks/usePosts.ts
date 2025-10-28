'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Post } from '@/types'
import { uploadImage, deleteImage, compressImage, MAX_IMAGES_PER_POST } from '@/lib/storage'

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 投稿一覧を取得（修正版）
  const fetchPosts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('投稿取得開始')
      
      // まず認証状態を確認
      const { data: { user } } = await supabase.auth.getUser()
      console.log('認証ユーザー:', user?.id)
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('投稿取得エラー:', error)
        // エラーでも空配列を設定して続行
        setPosts([])
        setError('投稿の取得に失敗しました: ' + error.message)
        return
      }
      
      console.log('投稿取得成功:', data?.length || 0, '件')
      console.log('投稿データ:', data)
      setPosts(data || [])
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('投稿の取得に失敗しました')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // 投稿を作成（デバッグ機能付き）
  const createPost = async (postData: {
    title: string
    content: string
    image_file?: File
    image_files?: File[]
    post_type?: string
  }) => {
    try {
      console.log('投稿作成開始:', postData)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('ユーザーがログインしていません')
        throw new Error('ログインが必要です')
      }

      console.log('認証ユーザー:', user.id)

      let imageUrl: string | undefined

      // 複数画像がアップロードされている場合
      let imageUrls: string[] = []
      if (postData.image_files && postData.image_files.length > 0) {
        console.log('複数画像アップロード開始:', postData.image_files.length)
        
        // 各画像を圧縮してからアップロード
        for (const file of postData.image_files) {
          const compressedFile = await compressImage(file)
          const uploadResult = await uploadImage(compressedFile, user.id)
          
          if ('error' in uploadResult) {
            console.error('画像アップロードエラー:', uploadResult.error)
            throw new Error(uploadResult.error)
          }
          
          imageUrls.push(uploadResult.url)
        }
        
        console.log('全画像アップロード成功:', imageUrls)
      }

      const postDataToInsert: any = {
        user_id: user.id,
        title: postData.title,
        content: postData.content,
        image_url: imageUrls[0] || null, // 後方互換性のため
      }

      console.log('投稿データを挿入:', postDataToInsert)

      const { data, error } = await supabase
        .from('posts')
        .insert(postDataToInsert)
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .single()

      if (error) {
        console.error('投稿作成エラー:', error)
        console.error('エラーメッセージ:', error.message)
        console.error('エラー詳細:', error.details)
        console.error('エラーコード:', error.code)
        
        // エラー内容を文字列として取得
        const errorMsg = error.message || JSON.stringify(error)
        throw new Error(errorMsg)
      }

      console.log('投稿作成成功:', data)
      setPosts(prev => [data, ...prev])
      return { data, error: null }
    } catch (err: any) {
      console.error('投稿作成catch:', err)
      const errorMessage = err?.message || err?.toString() || '投稿の作成に失敗しました'
      return { data: null, error: errorMessage }
    }
  }

  // 投稿を更新
  const updatePost = async (postId: string, postData: {
    title: string
    content?: string
    image_file?: File
    image_files?: File[]
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('ログインが必要です')

      // 複数画像がアップロードされている場合
      let imageUrls: string[] = []
      if (postData.image_files && postData.image_files.length > 0) {
        for (const file of postData.image_files) {
          const compressedFile = await compressImage(file)
          const uploadResult = await uploadImage(compressedFile, user.id)
          
          if ('error' in uploadResult) {
            throw new Error(uploadResult.error)
          }
          
          imageUrls.push(uploadResult.url)
        }
      }

      const { error } = await supabase
        .from('posts')
        .update({
          title: postData.title,
          content: postData.content,
          image_url: imageUrls[0] || null,
          image_urls: imageUrls.length > 0 ? imageUrls : null,
        })
        .eq('id', postId)

      if (error) throw error

      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, title: postData.title, content: postData.content || null, image_url: imageUrls[0], image_urls: imageUrls }
          : p
      ))
      return { data: null, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '投稿の更新に失敗しました'
      return { data: null, error: errorMessage }
    }
  }

  // 投稿を削除（軽量化）
  const deletePost = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('ログインが必要です')

      // 投稿を取得して画像URLを確認
      const { data: post } = await supabase
        .from('posts')
        .select('image_url, image_urls, user_id')
        .eq('id', postId)
        .single()

      if (post?.user_id !== user.id) {
        throw new Error('この投稿を削除する権限がありません')
      }

      // 画像を削除（単一画像）
      if (post?.image_url) {
        await deleteImage(post.image_url)
      }

      // 複数画像を削除
      if (post?.image_urls && Array.isArray(post.image_urls)) {
        for (const url of post.image_urls) {
          await deleteImage(url)
        }
      }

      // 投稿を削除
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error

      setPosts(prev => prev.filter(p => p.id !== postId))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '投稿の削除に失敗しました'
      return { error: errorMessage }
    }
  }

  // 簡易的な投稿取得（RLSポリシーを回避）
  const fetchPostsSimple = async () => {
    console.log('🔄 更新ボタンが押されました')
    setLoading(true)
    setError(null)
    
    try {
      console.log('簡易投稿取得開始')
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('簡易投稿取得エラー:', error)
        setError('投稿の取得に失敗しました')
        setLoading(false)
        return
      }
      
      console.log('簡易投稿取得成功:', data?.length || 0, '件')
      console.log('簡易投稿データ:', data)
      setPosts(data || [])
      setError(null)
    } catch (err) {
      console.error('簡易投稿取得エラー:', err)
      setError('投稿の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    refetch: fetchPosts,
    fetchPostsSimple,
  }
}