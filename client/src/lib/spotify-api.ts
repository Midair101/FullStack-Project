import { apiRequest } from './queryClient';

export interface SpotifyStatus {
  hasCredentials: boolean;
  authenticated: boolean;
}

export async function getSpotifyStatus(): Promise<SpotifyStatus> {
  const response = await fetch('/api/spotify/status');
  return response.json();
}

export async function getAuthUrl(): Promise<string | null> {
  const response = await fetch('/api/spotify/auth-url');
  const data = await response.json();
  if (data.error) {
    return null;
  }
  return data.url;
}

export async function logout(): Promise<void> {
  await apiRequest('POST', '/api/spotify/logout');
}

export async function getMe() {
  const response = await fetch('/api/spotify/me');
  if (!response.ok) throw new Error('Not authenticated');
  return response.json();
}

export async function search(query: string, type = 'track,artist,album,playlist', limit = 20) {
  const params = new URLSearchParams({ q: query, type, limit: String(limit) });
  const response = await fetch(`/api/spotify/search?${params}`);
  if (!response.ok) throw new Error('Search failed');
  return response.json();
}

export async function getFeaturedPlaylists(limit = 20) {
  const response = await fetch(`/api/spotify/browse/featured-playlists?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to get featured playlists');
  return response.json();
}

export async function getNewReleases(limit = 20) {
  const response = await fetch(`/api/spotify/browse/new-releases?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to get new releases');
  return response.json();
}

export async function getCategories(limit = 50) {
  const response = await fetch(`/api/spotify/browse/categories?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to get categories');
  return response.json();
}

export async function getPlaylist(id: string) {
  const response = await fetch(`/api/spotify/playlists/${id}`);
  if (!response.ok) throw new Error('Failed to get playlist');
  return response.json();
}

export async function getAlbum(id: string) {
  const response = await fetch(`/api/spotify/albums/${id}`);
  if (!response.ok) throw new Error('Failed to get album');
  return response.json();
}

export async function getArtist(id: string) {
  const response = await fetch(`/api/spotify/artists/${id}`);
  if (!response.ok) throw new Error('Failed to get artist');
  return response.json();
}

export async function getArtistTopTracks(id: string, market = 'US') {
  const response = await fetch(`/api/spotify/artists/${id}/top-tracks?market=${market}`);
  if (!response.ok) throw new Error('Failed to get artist top tracks');
  return response.json();
}

export async function getUserPlaylists(limit = 50) {
  const response = await fetch(`/api/spotify/me/playlists?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to get user playlists');
  return response.json();
}

export async function getRecentlyPlayed(limit = 20) {
  const response = await fetch(`/api/spotify/me/player/recently-played?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to get recently played');
  return response.json();
}

export async function getTopTracks(limit = 20, timeRange = 'medium_term') {
  const response = await fetch(`/api/spotify/me/top/tracks?limit=${limit}&time_range=${timeRange}`);
  if (!response.ok) throw new Error('Failed to get top tracks');
  return response.json();
}

export async function getTopArtists(limit = 20, timeRange = 'medium_term') {
  const response = await fetch(`/api/spotify/me/top/artists?limit=${limit}&time_range=${timeRange}`);
  if (!response.ok) throw new Error('Failed to get top artists');
  return response.json();
}

export async function getLikedSongs(limit = 50, offset = 0) {
  const response = await fetch(`/api/spotify/me/tracks?limit=${limit}&offset=${offset}`);
  if (!response.ok) throw new Error('Failed to get liked songs');
  return response.json();
}

export async function saveTrack(id: string) {
  await apiRequest('PUT', '/api/spotify/me/tracks', { ids: [id] });
}

export async function removeTrack(id: string) {
  await apiRequest('DELETE', '/api/spotify/me/tracks', { ids: [id] });
}

export async function checkSavedTracks(ids: string[]): Promise<boolean[]> {
  const response = await fetch(`/api/spotify/me/tracks/contains?ids=${ids.join(',')}`);
  if (!response.ok) throw new Error('Failed to check saved tracks');
  return response.json();
}

export async function getRecommendations(seedTracks?: string[], seedArtists?: string[], seedGenres?: string[], limit = 20) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (seedTracks?.length) params.append('seed_tracks', seedTracks.join(','));
  if (seedArtists?.length) params.append('seed_artists', seedArtists.join(','));
  if (seedGenres?.length) params.append('seed_genres', seedGenres.join(','));
  
  const response = await fetch(`/api/spotify/recommendations?${params}`);
  if (!response.ok) throw new Error('Failed to get recommendations');
  return response.json();
}
