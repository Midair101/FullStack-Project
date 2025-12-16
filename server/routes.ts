import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  generateAuthUrl,
  exchangeCode,
  isAuthenticated,
  clearTokens,
  spotifyApi,
  requireSpotifyAuth,
  getClientCredentials,
} from "./spotify";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Check if Spotify credentials are configured
  app.get("/api/spotify/status", (req, res) => {
    const hasCredentials = getClientCredentials() !== null;
    const authenticated = isAuthenticated();
    res.json({ hasCredentials, authenticated });
  });

  // Generate Spotify auth URL
  app.get("/api/spotify/auth-url", (req, res) => {
    const authUrl = generateAuthUrl(req);
    if (!authUrl) {
      return res.status(400).json({ 
        error: "Spotify credentials not configured",
        message: "Please add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to your environment"
      });
    }
    res.json({ url: authUrl });
  });

  // Handle OAuth callback
  app.get("/api/spotify/callback", async (req, res) => {
    const { code, error } = req.query;
    
    if (error) {
      return res.redirect("/?auth_error=" + encodeURIComponent(error as string));
    }
    
    if (!code) {
      return res.redirect("/?auth_error=no_code");
    }
    
    const tokens = await exchangeCode(code as string, req);
    
    if (!tokens) {
      return res.redirect("/?auth_error=token_exchange_failed");
    }
    
    res.redirect("/?auth_success=true");
  });

  // Logout
  app.post("/api/spotify/logout", (req, res) => {
    clearTokens();
    res.json({ success: true });
  });

  // Get current user profile
  app.get("/api/spotify/me", requireSpotifyAuth, async (req, res) => {
    try {
      const user = await spotifyApi("/me");
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Search
  app.get("/api/spotify/search", requireSpotifyAuth, async (req, res) => {
    try {
      const { q, type = "track,artist,album,playlist", limit = 20, offset = 0 } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: "Search query required" });
      }
      
      const params = new URLSearchParams({
        q: q as string,
        type: type as string,
        limit: String(limit),
        offset: String(offset),
      });
      
      const results = await spotifyApi(`/search?${params.toString()}`);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get featured playlists
  app.get("/api/spotify/browse/featured-playlists", requireSpotifyAuth, async (req, res) => {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const data = await spotifyApi(`/browse/featured-playlists?${params.toString()}`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get new releases
  app.get("/api/spotify/browse/new-releases", requireSpotifyAuth, async (req, res) => {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const data = await spotifyApi(`/browse/new-releases?${params.toString()}`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get categories
  app.get("/api/spotify/browse/categories", requireSpotifyAuth, async (req, res) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const data = await spotifyApi(`/browse/categories?${params.toString()}`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get category playlists
  app.get("/api/spotify/browse/categories/:id/playlists", requireSpotifyAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { limit = 20, offset = 0 } = req.query;
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const data = await spotifyApi(`/browse/categories/${id}/playlists?${params.toString()}`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get playlist
  app.get("/api/spotify/playlists/:id", requireSpotifyAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const playlist = await spotifyApi(`/playlists/${id}`);
      res.json(playlist);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get album
  app.get("/api/spotify/albums/:id", requireSpotifyAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const album = await spotifyApi(`/albums/${id}`);
      res.json(album);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get artist
  app.get("/api/spotify/artists/:id", requireSpotifyAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const artist = await spotifyApi(`/artists/${id}`);
      res.json(artist);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get artist top tracks
  app.get("/api/spotify/artists/:id/top-tracks", requireSpotifyAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { market = "US" } = req.query;
      const data = await spotifyApi(`/artists/${id}/top-tracks?market=${market}`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's playlists
  app.get("/api/spotify/me/playlists", requireSpotifyAuth, async (req, res) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const data = await spotifyApi(`/me/playlists?${params.toString()}`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's recently played
  app.get("/api/spotify/me/player/recently-played", requireSpotifyAuth, async (req, res) => {
    try {
      const { limit = 20 } = req.query;
      const params = new URLSearchParams({ limit: String(limit) });
      const data = await spotifyApi(`/me/player/recently-played?${params.toString()}`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's top tracks
  app.get("/api/spotify/me/top/tracks", requireSpotifyAuth, async (req, res) => {
    try {
      const { limit = 20, offset = 0, time_range = "medium_term" } = req.query;
      const params = new URLSearchParams({ 
        limit: String(limit), 
        offset: String(offset),
        time_range: time_range as string 
      });
      const data = await spotifyApi(`/me/top/tracks?${params.toString()}`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's top artists
  app.get("/api/spotify/me/top/artists", requireSpotifyAuth, async (req, res) => {
    try {
      const { limit = 20, offset = 0, time_range = "medium_term" } = req.query;
      const params = new URLSearchParams({ 
        limit: String(limit), 
        offset: String(offset),
        time_range: time_range as string 
      });
      const data = await spotifyApi(`/me/top/artists?${params.toString()}`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's saved tracks (liked songs)
  app.get("/api/spotify/me/tracks", requireSpotifyAuth, async (req, res) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const data = await spotifyApi(`/me/tracks?${params.toString()}`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Save track
  app.put("/api/spotify/me/tracks", requireSpotifyAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      await spotifyApi(`/me/tracks`, {
        method: 'PUT',
        body: JSON.stringify({ ids }),
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Remove saved track
  app.delete("/api/spotify/me/tracks", requireSpotifyAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      await spotifyApi(`/me/tracks`, {
        method: 'DELETE',
        body: JSON.stringify({ ids }),
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Check if tracks are saved
  app.get("/api/spotify/me/tracks/contains", requireSpotifyAuth, async (req, res) => {
    try {
      const { ids } = req.query;
      const data = await spotifyApi(`/me/tracks/contains?ids=${ids}`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get playback state
  app.get("/api/spotify/me/player", requireSpotifyAuth, async (req, res) => {
    try {
      const data = await spotifyApi(`/me/player`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Start/resume playback
  app.put("/api/spotify/me/player/play", requireSpotifyAuth, async (req, res) => {
    try {
      const { device_id } = req.query;
      const body = req.body;
      const params = device_id ? `?device_id=${device_id}` : '';
      await spotifyApi(`/me/player/play${params}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Pause playback
  app.put("/api/spotify/me/player/pause", requireSpotifyAuth, async (req, res) => {
    try {
      await spotifyApi(`/me/player/pause`, { method: 'PUT' });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Skip to next
  app.post("/api/spotify/me/player/next", requireSpotifyAuth, async (req, res) => {
    try {
      await spotifyApi(`/me/player/next`, { method: 'POST' });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Skip to previous
  app.post("/api/spotify/me/player/previous", requireSpotifyAuth, async (req, res) => {
    try {
      await spotifyApi(`/me/player/previous`, { method: 'POST' });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Seek to position
  app.put("/api/spotify/me/player/seek", requireSpotifyAuth, async (req, res) => {
    try {
      const { position_ms } = req.query;
      await spotifyApi(`/me/player/seek?position_ms=${position_ms}`, { method: 'PUT' });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Set volume
  app.put("/api/spotify/me/player/volume", requireSpotifyAuth, async (req, res) => {
    try {
      const { volume_percent } = req.query;
      await spotifyApi(`/me/player/volume?volume_percent=${volume_percent}`, { method: 'PUT' });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Toggle shuffle
  app.put("/api/spotify/me/player/shuffle", requireSpotifyAuth, async (req, res) => {
    try {
      const { state } = req.query;
      await spotifyApi(`/me/player/shuffle?state=${state}`, { method: 'PUT' });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Set repeat mode
  app.put("/api/spotify/me/player/repeat", requireSpotifyAuth, async (req, res) => {
    try {
      const { state } = req.query;
      await spotifyApi(`/me/player/repeat?state=${state}`, { method: 'PUT' });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get available devices
  app.get("/api/spotify/me/player/devices", requireSpotifyAuth, async (req, res) => {
    try {
      const data = await spotifyApi(`/me/player/devices`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Transfer playback
  app.put("/api/spotify/me/player", requireSpotifyAuth, async (req, res) => {
    try {
      const { device_ids, play } = req.body;
      await spotifyApi(`/me/player`, {
        method: 'PUT',
        body: JSON.stringify({ device_ids, play }),
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get recommendations
  app.get("/api/spotify/recommendations", requireSpotifyAuth, async (req, res) => {
    try {
      const { seed_artists, seed_genres, seed_tracks, limit = 20 } = req.query;
      const params = new URLSearchParams({ limit: String(limit) });
      
      if (seed_artists) params.append('seed_artists', seed_artists as string);
      if (seed_genres) params.append('seed_genres', seed_genres as string);
      if (seed_tracks) params.append('seed_tracks', seed_tracks as string);
      
      const data = await spotifyApi(`/recommendations?${params.toString()}`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
