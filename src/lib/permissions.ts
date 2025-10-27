// 権限チェックユーティリティ

export type UserRole = 'admin' | 'poster' | 'viewer' | 'store'
export type PostType = 'user' | 'store'

/**
 * ユーザーがユーザー投稿を作成できるかチェック
 */
export function canCreateUserPost(role: string): boolean {
  return role === 'admin' || role === 'poster'
}

/**
 * ユーザーが店舗投稿を作成できるかチェック
 */
export function canCreateStorePost(role: string): boolean {
  return role === 'store'
}

/**
 * ユーザーが投稿を編集できるかチェック（自分の投稿または管理者）
 */
export function canEditPost(role: string, isOwner: boolean): boolean {
  return isOwner && (role === 'admin' || role === 'poster' || role === 'store')
}

/**
 * ユーザーが投稿を削除できるかチェック（自分の投稿または管理者）
 */
export function canDeletePost(role: string, isOwner: boolean): boolean {
  return role === 'admin' || (isOwner && (role === 'admin' || role === 'poster' || role === 'store'))
}

/**
 * ユーザーがいいね・コメントできるかチェック
 */
export function canInteract(role: string): boolean {
  return ['admin', 'poster', 'viewer', 'store'].includes(role)
}

/**
 * ユーザーの表示名を取得
 */
export function getRoleDisplayName(role: string): string {
  const names: Record<string, string> = {
    admin: '管理者',
    poster: '投稿者',
    viewer: '閲覧者',
    store: '店舗'
  }
  return names[role] || role
}


