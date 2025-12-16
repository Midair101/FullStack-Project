import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// TypeScript interfaces for Spotify-like data structures
export interface Artist {
  id: string;
  name: string;
  imageUrl: string | null;
  followers?: number;
  genres?: string[];
}

export interface Album {
  id: string;
  name: string;
  imageUrl: string;
  artistId: string;
  artistName: string;
  releaseDate: string;
  totalTracks: number;
  type: 'album' | 'single' | 'compilation';
}

export interface Track {
  id: string;
  name: string;
  artistId: string;
  artistName: string;
  albumId: string;
  albumName: string;
  albumImageUrl: string;
  durationMs: number;
  trackNumber: number;
  previewUrl: string | null;
  explicit: boolean;
  isPlayable: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  ownerId: string;
  ownerName: string;
  isPublic: boolean;
  totalTracks: number;
  followers?: number;
}

export interface PlaylistTrack {
  addedAt: string;
  track: Track;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface SearchResults {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

export interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  queue: Track[];
  position: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: 'off' | 'track' | 'context';
}

export interface FeaturedPlaylist {
  message: string;
  playlists: Playlist[];
}

export interface NewReleases {
  albums: Album[];
}

export interface TopTracks {
  tracks: Track[];
}
