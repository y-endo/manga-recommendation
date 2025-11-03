// ユーザー型
export interface User {
  id: string
  email: string
  username: string
  created_at: string
  updated_at: string
}

// 漫画型
export interface Manga {
  id: string
  title: string
  author: string
  description: string
  cover_image: string
  genre: string[]
  created_at: string
  updated_at: string
}

// レビュー型
export interface Review {
  id: string
  user_id: string
  manga_id: string
  rating: number // 1-5
  comment: string
  created_at: string
  updated_at: string
}

// 読書リスト型
export interface ReadingList {
  id: string
  user_id: string
  manga_id: string
  status: 'reading' | 'completed' | 'plan_to_read'
  created_at: string
  updated_at: string
}

// 認証リクエスト型
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  username: string
}

// 認証レスポンス型
export interface AuthResponse {
  token: string
  user: User
}

// APIエラー型
export interface APIError {
  message: string
  code?: string
}
