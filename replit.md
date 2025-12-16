# Gotify - Spotify Clone Music Player

## Overview
Gotify is a Spotify-inspired music player application that provides a pixel-perfect clone of Spotify's interface. It features a dark theme UI with green accent colors, complete with sidebar navigation, playback controls, and integration-ready Spotify API endpoints.

## Project Architecture

### Frontend (client/src/)
- **React + TypeScript** with Vite bundler
- **Tailwind CSS** for styling with custom Spotify-dark theme
- **Shadcn UI** components
- **TanStack Query** for data fetching
- **Wouter** for routing

### Backend (server/)
- **Express.js** server
- **Spotify API integration** with OAuth 2.0 flow
- RESTful API endpoints for all Spotify features

### Key Files
- `client/src/App.tsx` - Main application with layout and routing
- `client/src/lib/player-context.tsx` - Audio playback state management
- `client/src/lib/spotify-api.ts` - Spotify API client functions
- `client/src/components/` - Reusable UI components
- `client/src/pages/` - Route pages (Home, Search, Playlist)
- `server/spotify.ts` - Spotify OAuth and API helpers
- `server/routes.ts` - API endpoints

## Features

### Implemented
- Spotify-like dark theme UI (#000 background, #1DB954 green accent)
- Left sidebar with Home, Search, Library navigation
- Home page with featured playlists, new releases, popular artists
- Search page with category browsing and search results display
- Playlist detail view with track listing
- Bottom playback control bar (play/pause, skip, progress, volume)
- Player context for audio state management
- Demo data for UI preview

### Spotify API Integration (Ready for credentials)
- OAuth 2.0 authentication flow
- Search (tracks, artists, albums, playlists)
- Browse (featured playlists, new releases, categories)
- User data (profile, playlists, saved tracks)
- Playback control endpoints
- Recommendations

## Setup

### Spotify API Credentials Required
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Add the redirect URI: `https://[your-replit-url]/api/spotify/callback`
4. Copy Client ID and Client Secret
5. Add as Replit secrets:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`

## Development
- Run: `npm run dev`
- Frontend: http://localhost:5000
- Backend serves the same port

## Recent Changes
- December 2024: Initial build of Gotify music player
- Complete Spotify-clone UI with dark theme
- Full backend API routes for Spotify integration
- OAuth flow ready for Spotify credentials
