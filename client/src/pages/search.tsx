import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { MusicCard, CardRow } from '@/components/music-card';
import { TrackList } from '@/components/track-list';
import { Search as SearchIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Track, Album, Artist, Playlist, Category } from '@shared/schema';

const categories: Category[] = [
  { id: 'c1', name: 'Music', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop' },
  { id: 'c2', name: 'Podcasts', imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=300&fit=crop' },
  { id: 'c3', name: 'Live Events', imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=300&fit=crop' },
  { id: 'c4', name: 'Made For You', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
  { id: 'c5', name: 'New Releases', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' },
  { id: 'c6', name: 'Pop', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop' },
  { id: 'c7', name: 'Hip-Hop', imageUrl: 'https://images.unsplash.com/photo-1571609860754-01dcc6c5da15?w=300&h=300&fit=crop' },
  { id: 'c8', name: 'Rock', imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop' },
  { id: 'c9', name: 'Latin', imageUrl: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop' },
  { id: 'c10', name: 'Dance/Electronic', imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop' },
  { id: 'c11', name: 'Mood', imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop' },
  { id: 'c12', name: 'Indie', imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop' },
];

const demoTracks: Track[] = [
  { id: 't1', name: 'Blinding Lights', artistId: 'a1', artistName: 'The Weeknd', albumId: 'al1', albumName: 'After Hours', albumImageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', durationMs: 200000, trackNumber: 1, previewUrl: null, explicit: false, isPlayable: true },
  { id: 't2', name: 'Levitating', artistId: 'a2', artistName: 'Dua Lipa', albumId: 'al2', albumName: 'Future Nostalgia', albumImageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', durationMs: 203000, trackNumber: 1, previewUrl: null, explicit: false, isPlayable: true },
  { id: 't3', name: "God's Plan", artistId: 'a3', artistName: 'Drake', albumId: 'al3', albumName: 'Scorpion', albumImageUrl: 'https://images.unsplash.com/photo-1571609860754-01dcc6c5da15?w=300&h=300&fit=crop', durationMs: 198000, trackNumber: 1, previewUrl: null, explicit: true, isPlayable: true },
  { id: 't4', name: 'Anti-Hero', artistId: 'a4', artistName: 'Taylor Swift', albumId: 'al4', albumName: 'Midnights', albumImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop', durationMs: 200000, trackNumber: 1, previewUrl: null, explicit: false, isPlayable: true },
];

const demoArtists: Artist[] = [
  { id: 'a1', name: 'The Weeknd', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', followers: 85000000 },
  { id: 'a2', name: 'Dua Lipa', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', followers: 72000000 },
];

const demoAlbums: Album[] = [
  { id: 'al1', name: 'After Hours', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', artistId: 'a1', artistName: 'The Weeknd', releaseDate: '2020-03-20', totalTracks: 14, type: 'album' },
  { id: 'al2', name: 'Future Nostalgia', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', artistId: 'a2', artistName: 'Dua Lipa', releaseDate: '2020-03-27', totalTracks: 11, type: 'album' },
];

const demoPlaylists: Playlist[] = [
  { id: 'sp1', name: 'This Is The Weeknd', description: 'All his greatest hits', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 50 },
  { id: 'sp2', name: 'Pop Rising', description: 'Tomorrow\'s hits today', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 50 },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    setHasSearched(value.length > 0);
  };

  const clearSearch = () => {
    setQuery('');
    setHasSearched(false);
  };

  return (
    <div className="min-h-full pb-8">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-8 py-4">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10 h-12 bg-card border-0 text-base rounded-full"
            data-testid="input-search"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={clearSearch}
              data-testid="button-clear-search"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="px-8 pt-4">
        {!hasSearched ? (
          /* Browse Categories */
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6" data-testid="text-browse-all">
              Browse all
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover-elevate"
                  data-testid={`card-category-${category.id}`}
                >
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Search Results */
          <div className="space-y-8">
            {/* Top Result & Songs */}
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
              {/* Top Result */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-top-result">
                  Top result
                </h2>
                <div className="p-5 rounded-lg bg-card hover-elevate cursor-pointer">
                  <img 
                    src={demoArtists[0].imageUrl || ''} 
                    alt={demoArtists[0].name}
                    className="w-24 h-24 rounded-full mb-5"
                  />
                  <h3 className="text-3xl font-bold text-foreground mb-1">
                    {demoArtists[0].name}
                  </h3>
                  <p className="text-sm text-muted-foreground">Artist</p>
                </div>
              </div>

              {/* Songs */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-songs">
                  Songs
                </h2>
                <TrackList tracks={demoTracks} showAlbum={false} showHeader={false} />
              </div>
            </div>

            {/* Artists */}
            <CardRow title="Artists">
              {demoArtists.map((artist) => (
                <MusicCard 
                  key={artist.id} 
                  type="artist" 
                  data={artist}
                />
              ))}
            </CardRow>

            {/* Albums */}
            <CardRow title="Albums">
              {demoAlbums.map((album) => (
                <MusicCard 
                  key={album.id} 
                  type="album" 
                  data={album}
                />
              ))}
            </CardRow>

            {/* Playlists */}
            <CardRow title="Playlists">
              {demoPlaylists.map((playlist) => (
                <MusicCard 
                  key={playlist.id} 
                  type="playlist" 
                  data={playlist}
                />
              ))}
            </CardRow>
          </div>
        )}
      </div>
    </div>
  );
}
