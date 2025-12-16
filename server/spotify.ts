import type { Request, Response, NextFunction } from 'express';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

let tokens: SpotifyTokens | null = null;

export function getClientCredentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return null;
  }
  
  return { clientId, clientSecret };
}

export function getRedirectUri(req: Request) {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  return `${protocol}://${host}/api/spotify/callback`;
}

export function generateAuthUrl(req: Request): string | null {
  const credentials = getClientCredentials();
  if (!credentials) return null;
  
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'user-library-modify',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-top-read',
    'streaming',
  ].join(' ');
  
  const params = new URLSearchParams({
    client_id: credentials.clientId,
    response_type: 'code',
    redirect_uri: getRedirectUri(req),
    scope: scopes,
    show_dialog: 'true',
  });
  
  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCode(code: string, req: Request): Promise<SpotifyTokens | null> {
  const credentials = getClientCredentials();
  if (!credentials) return null;
  
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: getRedirectUri(req),
  });
  
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  
  if (!response.ok) {
    console.error('Token exchange failed:', await response.text());
    return null;
  }
  
  const data = await response.json();
  
  tokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  
  return tokens;
}

export async function refreshAccessToken(): Promise<boolean> {
  if (!tokens?.refreshToken) return false;
  
  const credentials = getClientCredentials();
  if (!credentials) return false;
  
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: tokens.refreshToken,
  });
  
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  
  if (!response.ok) {
    console.error('Token refresh failed:', await response.text());
    return false;
  }
  
  const data = await response.json();
  
  tokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || tokens.refreshToken,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  
  return true;
}

export async function getValidAccessToken(): Promise<string | null> {
  if (!tokens) return null;
  
  if (Date.now() >= tokens.expiresAt - 60000) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) return null;
  }
  
  return tokens.accessToken;
}

export function isAuthenticated(): boolean {
  return tokens !== null && tokens.expiresAt > Date.now();
}

export function clearTokens() {
  tokens = null;
}

export async function spotifyApi(endpoint: string, options: RequestInit = {}): Promise<any> {
  const accessToken = await getValidAccessToken();
  
  if (!accessToken) {
    throw new Error('Not authenticated with Spotify');
  }
  
  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify API error: ${response.status} - ${error}`);
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}

export function requireSpotifyAuth(req: Request, res: Response, next: NextFunction) {
  if (!isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated with Spotify' });
  }
  next();
}
