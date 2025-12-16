import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { MusicCard, CardRow } from '@/components/music-card';
import { TrackList } from '@/components/track-list';
import { Skeleton } from '@/components/ui/skeleton';
import { Search as SearchIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSpotifyStatus, search, getCategories } from '@/lib/spotify-api';
import type { Track, Album, Artist, Playlist, Category } from '@shared/schema';

const demoCategories: Category[] = [
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
  { id: 't1', name: 'Blinding Lights', artistId: 'a1', artistName: 'The Weeknd', albumId: 'al1', albumName: 'After Hours', albumImageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', durationMs: 200000, trackNumber: 1, previewUrl: 'https://p.scdn.co/mp3-preview/0b55d0c4b1c4a3c5e4c7b8f1d8e4c8c1e0f1g2h3', explicit: false, isPlayable: true },
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

function mapSpotifyTrack(t: any): Track {
  return {
    id: t.id,
    name: t.name,
    artistId: t.artists?.[0]?.id || '',
    artistName: t.artists?.map((a: any) => a.name).join(', ') || '',
    albumId: t.album?.id || '',
    albumName: t.album?.name || '',
    albumImageUrl: t.album?.images?.[0]?.url || '',
    durationMs: t.duration_ms,
    trackNumber: t.track_number,
    previewUrl: t.preview_url,
    explicit: t.explicit,
    isPlayable: !t.is_local,
  };
}

function mapSpotifyArtist(a: any): Artist {
  return {
    id: a.id,
    name: a.name,
    imageUrl: a.images?.[0]?.url || null,
    followers: a.followers?.total,
  };
}

function mapSpotifyAlbum(a: any): Album {
  return {
    id: a.id,
    name: a.name,
    imageUrl: a.images?.[0]?.url || '',
    artistId: a.artists?.[0]?.id || '',
    artistName: a.artists?.map((ar: any) => ar.name).join(', ') || '',
    releaseDate: a.release_date,
    totalTracks: a.total_tracks,
    type: a.album_type,
  };
}

function mapSpotifyPlaylist(p: any): Playlist {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    imageUrl: p.images?.[0]?.url || null,
    ownerId: p.owner?.id,
    ownerName: p.owner?.display_name || 'Spotify',
    isPublic: p.public,
    totalTracks: p.tracks?.total || 0,
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: status } = useQuery({
    queryKey: ['/api/spotify/status'],
    queryFn: getSpotifyStatus,
  });

  const isAuthenticated = status?.authenticated;

  const { data: categoriesData } = useQuery({
    queryKey: ['/api/spotify/categories'],
    queryFn: () => getCategories(20),
    enabled: isAuthenticated,
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['/api/spotify/search', debouncedQuery],
    queryFn: () => search(debouncedQuery),
    enabled: isAuthenticated && debouncedQuery.length > 0,
  });

  const categories = isAuthenticated && categoriesData?.categories?.items
    ? categoriesData.categories.items.map((c: any) => ({
        id: c.id,
        name: c.name,
        imageUrl: c.icons?.[0]?.url || '',
      }))
    : demoCategories;

  const hasSearched = query.length > 0;

  const clearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  const tracks = isAuthenticated && searchResults?.tracks?.items
    ? searchResults.tracks.items.map(mapSpotifyTrack)
    : hasSearched ? demoTracks.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.artistName.toLowerCase().includes(query.toLowerCase())
      ) : [];

  const artists = isAuthenticated && searchResults?.artists?.items
    ? searchResults.artists.items.slice(0, 6).map(mapSpotifyArtist)
    : hasSearched ? demoArtists : [];

  const albums = isAuthenticated && searchResults?.albums?.items
    ? searchResults.albums.items.slice(0, 6).map(mapSpotifyAlbum)
    : hasSearched ? demoAlbums : [];

  const playlists = isAuthenticated && searchResults?.playlists?.items
    ? searchResults.playlists.items.slice(0, 6).map(mapSpotifyPlaylist)
    : hasSearched ? demoPlaylists : [];

  const topResult = artists[0] || null;

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
            onChange={(e) => setQuery(e.target.value)}
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
        ) : searchLoading && isAuthenticated ? (
          /* Loading State */
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Top result</h2>
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Songs</h2>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Search Results */
          <div className="space-y-8">
            {/* Top Result & Songs */}
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
              {/* Top Result */}
              {topResult && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-top-result">
                    Top result
                  </h2>
                  <div className="p-5 rounded-lg bg-card hover-elevate cursor-pointer">
                    {topResult.imageUrl ? (
                      <img 
                        src={topResult.imageUrl} 
                        alt={topResult.name}
                        className="w-24 h-24 rounded-full mb-5 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mb-5 bg-muted flex items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground">{topResult.name.charAt(0)}</span>
                      </div>
                    )}
                    <h3 className="text-3xl font-bold text-foreground mb-1">
                      {topResult.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">Artist</p>
                  </div>
                </div>
              )}

              {/* Songs */}
              {tracks.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-songs">
                    Songs
                  </h2>
                  <TrackList tracks={tracks.slice(0, 4)} showAlbum={false} showHeader={false} />
                </div>
              )}
            </div>

            {/* Artists */}
            {artists.length > 0 && (
              <CardRow title="Artists">
                {artists.map((artist) => (
                  <MusicCard 
                    key={artist.id} 
                    type="artist" 
                    data={artist}
                  />
                ))}
              </CardRow>
            )}

            {/* Albums */}
            {albums.length > 0 && (
              <CardRow title="Albums">
                {albums.map((album) => (
                  <MusicCard 
                    key={album.id} 
                    type="album" 
                    data={album}
                  />
                ))}
              </CardRow>
            )}

            {/* Playlists */}
            {playlists.length > 0 && (
              <CardRow title="Playlists">
                {playlists.map((playlist) => (
                  <MusicCard 
                    key={playlist.id} 
                    type="playlist" 
                    data={playlist}
                  />
                ))}
              </CardRow>
            )}

            {/* No Results */}
            {tracks.length === 0 && artists.length === 0 && albums.length === 0 && playlists.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl font-bold text-foreground mb-2">No results found for "{query}"</p>
                <p className="text-muted-foreground">Please check your spelling or try different keywords.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
