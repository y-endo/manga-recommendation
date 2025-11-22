import { BACKEND_API_URL } from '@/shared/lib/constants';

/**
 * APIクライアント
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * 共通のfetchメソッド
   */
  private async fetch<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      ...init,
      credentials: 'include',
    });

    if (!response.ok) {
      let message = '';
      try {
        const body = await response.json();
        message = body.message;
      } catch {
        message = response.statusText;
      }
      throw new Error(`API Error ${response.status}: ${message}`);
    }

    return response.json();
  }

  /**
   * GETリクエスト
   */
  async get<T>(path: string, init: RequestInit = {}): Promise<T> {
    return this.fetch<T>(path, { method: 'GET', ...init });
  }

  /**
   * POSTリクエスト
   */
  async post<T>(path: string, data?: unknown): Promise<T> {
    return this.fetch<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUTリクエスト
   */
  async put<T>(path: string, data?: unknown): Promise<T> {
    return this.fetch<T>(path, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETEリクエスト
   */
  async delete<T>(path: string): Promise<T> {
    return this.fetch<T>(path, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(BACKEND_API_URL);
