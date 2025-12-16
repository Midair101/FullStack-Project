import { useQuery } from '@tanstack/react-query';
import { MusicCard, CardRow } from '@/components/music-card';
import { SpotifyConnect } from '@/components/spotify-connect';
import { Skeleton } from '@/components/ui/skeleton';
import { getSpotifyStatus, getFeaturedPlaylists, getNewReleases, getTopArtists } from '@/lib/spotify-api';
import type { Album, Playlist, Artist } from '@shared/schema';

const demoFeaturedPlaylists: Playlist[] = [
  { id: 'fp1', name: 'Today\'s Top Hits', description: 'The hottest tracks right now', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 50 },
  { id: 'fp2', name: 'RapCaviar', description: 'Hip-hop favorites', imageUrl: 'https://images.unsplash.com/photo-1571609860754-01dcc6c5da15?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 50 },
  { id: 'fp3', name: 'All Out 2010s', description: 'The biggest songs of the 2010s', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 100 },
  { id: 'fp4', name: 'Rock Classics', description: 'Rock legends & icons', imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 80 },
  { id: 'fp5', name: 'Chill Hits', description: 'Kick back with the best', imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 60 },
  { id: 'fp6', name: 'Mood Booster', description: 'Feel-good music', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 75 },
];

const demoNewReleases: Album[] = [
  { id: 'nr1', name: 'Midnight Dreams', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop', artistId: 'a1', artistName: 'Luna Rose', releaseDate: '2024-01-15', totalTracks: 12, type: 'album' },
  { id: 'nr2', name: 'Electric Soul', imageUrl: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop', artistId: 'a2', artistName: 'The Voltage', releaseDate: '2024-01-12', totalTracks: 10, type: 'album' },
  { id: 'nr3', name: 'Urban Poetry', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', artistId: 'a3', artistName: 'Metro Beats', releaseDate: '2024-01-10', totalTracks: 14, type: 'album' },
  { id: 'nr4', name: 'Summer Nights', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', artistId: 'a4', artistName: 'Coastal', releaseDate: '2024-01-08', totalTracks: 8, type: 'album' },
  { id: 'nr5', name: 'Echoes', imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop', artistId: 'a5', artistName: 'Sound Wave', releaseDate: '2024-01-05', totalTracks: 11, type: 'single' },
  { id: 'nr6', name: 'Neon Lights', imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop', artistId: 'a6', artistName: 'Synth City', releaseDate: '2024-01-03', totalTracks: 9, type: 'album' },
];

const demoPopularArtists: Artist[] = [
  { id: 'pa1', name: 'The Weeknd', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', followers: 85000000 },
  { id: 'pa2', name: 'Dua Lipa', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', followers: 72000000 },
  { id: 'pa3', name: 'Drake', imageUrl: 'https://images.unsplash.com/photo-1571609860754-01dcc6c5da15?w=300&h=300&fit=crop', followers: 95000000 },
  { id: 'pa4', name: 'Taylor Swift', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop', followers: 110000000 },
  { id: 'pa5', name: 'Bad Bunny', imageUrl: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop', followers: 65000000 },
  { id: 'pa6', name: 'Billie Eilish', imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop', followers: 78000000 },
];

const demoRecentlyPlayed: Playlist[] = [
  { id: 'rp1', name: 'Daily Mix 1', description: 'Your daily mix', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 50 },
  { id: 'rp2', name: 'Discover Weekly', description: 'New music for you', imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 30 },
  { id: 'rp3', name: 'Release Radar', description: 'New releases', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 30 },
  { id: 'rp4', name: 'On Repeat', description: 'Songs you love', imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 30 },
  { id: 'rp5', name: 'Repeat Rewind', description: 'Past favorites', imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 30 },
  { id: 'rp6', name: 'Time Capsule', description: 'Your throwbacks', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 50 },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function CardSkeleton() {
  return (
    <div className="p-4 rounded-md bg-card">
      <Skeleton className="aspect-square w-full rounded-md mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

function CardRowSkeleton({ title }: { title: string }) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { data: status } = useQuery({
    queryKey: ['/api/spotify/status'],
    queryFn: getSpotifyStatus,
  });

  const isAuthenticated = status?.authenticated;
  const showConnectCard = !isAuthenticated;

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/spotify/featured'],
    queryFn: () => getFeaturedPlaylists(6),
    enabled: isAuthenticated,
  });

  const { data: releasesData, isLoading: releasesLoading } = useQuery({
    queryKey: ['/api/spotify/releases'],
    queryFn: () => getNewReleases(6),
    enabled: isAuthenticated,
  });

  const { data: artistsData, isLoading: artistsLoading } = useQuery({
    queryKey: ['/api/spotify/top-artists'],
    queryFn: () => getTopArtists(6),
    enabled: isAuthenticated,
  });

  const featuredPlaylists = isAuthenticated && featuredData?.playlists?.items 
    ? featuredData.playlists.items.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        imageUrl: p.images?.[0]?.url || null,
        ownerId: p.owner?.id,
        ownerName: p.owner?.display_name || 'Spotify',
        isPublic: p.public,
        totalTracks: p.tracks?.total || 0,
      }))
    : demoFeaturedPlaylists;

  const newReleases = isAuthenticated && releasesData?.albums?.items
    ? releasesData.albums.items.map((a: any) => ({
        id: a.id,
        name: a.name,
        imageUrl: a.images?.[0]?.url || '',
        artistId: a.artists?.[0]?.id || '',
        artistName: a.artists?.map((ar: any) => ar.name).join(', ') || '',
        releaseDate: a.release_date,
        totalTracks: a.total_tracks,
        type: a.album_type,
      }))
    : demoNewReleases;

  const popularArtists = isAuthenticated && artistsData?.items
    ? artistsData.items.map((a: any) => ({
        id: a.id,
        name: a.name,
        imageUrl: a.images?.[0]?.url || null,
        followers: a.followers?.total,
      }))
    : demoPopularArtists;

  const recentlyPlayed = demoRecentlyPlayed;

  return (
    <div className="min-h-full pb-8">
      {/* Gradient Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-background pointer-events-none h-[332px]" />
        
        <div className="relative px-8 pt-8">
          <h1 className="text-3xl font-bold text-foreground mb-6" data-testid="text-greeting">
            {getGreeting()}
          </h1>

          {/* Spotify Connect Card */}
          {showConnectCard && (
            <div className="mb-8 max-w-xl">
              <SpotifyConnect />
            </div>
          )}

          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {featuredPlaylists.slice(0, 6).map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center gap-4 bg-card/60 rounded-md overflow-hidden hover-elevate cursor-pointer group"
                data-testid={`card-quick-${playlist.id}`}
              >
                {playlist.imageUrl ? (
                  <img 
                    src={playlist.imageUrl} 
                    alt={playlist.name}
                    className="w-20 h-20 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-muted flex items-center justify-center">
                    <span className="text-2xl font-bold text-muted-foreground">{playlist.name.charAt(0)}</span>
                  </div>
                )}
                <span className="font-semibold text-foreground pr-4 truncate">
                  {playlist.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-8 space-y-8">
        {featuredLoading && isAuthenticated ? (
          <CardRowSkeleton title="Made For You" />
        ) : (
          <CardRow title="Made For You">
            {recentlyPlayed.map((playlist) => (
              <MusicCard 
                key={playlist.id} 
                type="playlist" 
                data={playlist}
              />
            ))}
          </CardRow>
        )}

        {releasesLoading && isAuthenticated ? (
          <CardRowSkeleton title="New Releases" />
        ) : (
          <CardRow title="New Releases">
            {newReleases.map((album) => (
              <MusicCard 
                key={album.id} 
                type="album" 
                data={album}
              />
            ))}
          </CardRow>
        )}

        {artistsLoading && isAuthenticated ? (
          <CardRowSkeleton title="Popular Artists" />
        ) : (
          <CardRow title="Popular Artists">
            {popularArtists.map((artist) => (
              <MusicCard 
                key={artist.id} 
                type="artist" 
                data={artist}
              />
            ))}
          </CardRow>
        )}

        <CardRow title="Featured Playlists">
          {featuredPlaylists.map((playlist) => (
            <MusicCard 
              key={playlist.id} 
              type="playlist" 
              data={playlist}
            />
          ))}
        </CardRow>
      </div>
    </div>
  );
}
