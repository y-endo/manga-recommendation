import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';

/**
 * Goへのプロキシ処理を行う
 */
async function proxyRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;

  const backendUrl = `${BACKEND_URL}/api/${path.join('/')}`;

  // クリリパラメータを付与
  const searchParams = request.nextUrl.searchParams.toString();
  const finalUrl = searchParams ? `${backendUrl}?${searchParams}` : backendUrl;

  try {
    const body = request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined;

    // リクエストヘッダーの準備
    const requestHeaders = new Headers();
    // 必要なヘッダーを明示的に転送
    const contentType = request.headers.get('Content-Type');
    if (contentType) requestHeaders.set('Content-Type', contentType);

    const authorization = request.headers.get('Authorization');
    if (authorization) requestHeaders.set('Authorization', authorization);

    // Cookieを転送（セッション維持に必要）
    const cookie = request.headers.get('Cookie');
    if (cookie) requestHeaders.set('Cookie', cookie);

    const response = await fetch(finalUrl, {
      method: request.method,
      headers: requestHeaders,
      body,
      cache: 'no-store',
    });

    const data = await response.blob();

    // レスポンスヘッダーの準備
    const responseHeaders = new Headers();
    const resContentType = response.headers.get('Content-Type');
    if (resContentType) responseHeaders.set('Content-Type', resContentType);

    // Set-Cookieを転送（ログイン・ログアウト処理に必要）
    const setCookie = response.headers.get('Set-Cookie');
    if (setCookie) responseHeaders.set('Set-Cookie', setCookie);

    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy request failed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
