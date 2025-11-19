import { API_BASE_URL } from '@/lib/constants';

interface FetchOptions extends RequestInit {
  token?: string;
}

/**
 * APIクライアント - バックエンドAPIとの通信を担当
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * 共通のfetchメソッド
   */
  private async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers = new Headers(fetchOptions.headers);

    // Ensure Content-Type header is set
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  /**
   * GETリクエスト
   */
  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET', token });
  }

  /**
   * POSTリクエスト
   */
  async post<T>(endpoint: string, data?: unknown, token?: string): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  /**
   * PUTリクエスト
   */
  async put<T>(endpoint: string, data?: unknown, token?: string): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  /**
   * DELETEリクエスト
   */
  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'DELETE', token });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
