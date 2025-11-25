// ユーザー型
export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export type AuthUser = Omit<User, 'created_at' | 'updated_at'>;

// 漫画リスト型
export interface MangaListItem {
  slug: string;
  title: string;
  author: string;
  cover_image: string | null;
  genre: string[];
  tags: string[];
  likes_count: number;
  avg_rating: number;
  published_year: number;
}

// 漫画詳細型
export interface MangaDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image: string | null;
  published_year: number;
  likes_count: number;
  reviews_count: number;
  avg_rating: number;
  authors: string[];
  genres: string[];
  tags: string[];
}

// レビュー型
export interface Review {
  id: string;
  user_id: string;
  manga_id: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
  updated_at: string;
}

// 読書リスト型
export interface ReadingList {
  id: string;
  user_id: string;
  manga_id: string;
  status: 'reading' | 'completed' | 'plan_to_read';
  created_at: string;
  updated_at: string;
}

// 認証リクエスト型
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

// 認証レスポンス型
export interface AuthResponse {
  data: {
    user: AuthUser;
  };
  message: string;
}

// 漫画一覧レスポンス型
export interface MangaListResponse {
  data: MangaListItem[];
  message: string;
}

// 漫画詳細レスポンス型
export interface MangaDetailResponse {
  data: MangaDetail;
  message: string;
}
