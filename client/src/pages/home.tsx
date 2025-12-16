import { MusicCard, CardRow } from '@/components/music-card';
import type { Album, Playlist, Artist } from '@shared/schema';

const featuredPlaylists: Playlist[] = [
  { id: 'fp1', name: 'Today\'s Top Hits', description: 'The hottest tracks right now', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 50 },
  { id: 'fp2', name: 'RapCaviar', description: 'Hip-hop favorites', imageUrl: 'https://images.unsplash.com/photo-1571609860754-01dcc6c5da15?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 50 },
  { id: 'fp3', name: 'All Out 2010s', description: 'The biggest songs of the 2010s', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 100 },
  { id: 'fp4', name: 'Rock Classics', description: 'Rock legends & icons', imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 80 },
  { id: 'fp5', name: 'Chill Hits', description: 'Kick back with the best', imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 60 },
  { id: 'fp6', name: 'Mood Booster', description: 'Feel-good music', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop', ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 75 },
];

const newReleases: Album[] = [
  { id: 'nr1', name: 'Midnight Dreams', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop', artistId: 'a1', artistName: 'Luna Rose', releaseDate: '2024-01-15', totalTracks: 12, type: 'album' },
  { id: 'nr2', name: 'Electric Soul', imageUrl: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop', artistId: 'a2', artistName: 'The Voltage', releaseDate: '2024-01-12', totalTracks: 10, type: 'album' },
  { id: 'nr3', name: 'Urban Poetry', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', artistId: 'a3', artistName: 'Metro Beats', releaseDate: '2024-01-10', totalTracks: 14, type: 'album' },
  { id: 'nr4', name: 'Summer Nights', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', artistId: 'a4', artistName: 'Coastal', releaseDate: '2024-01-08', totalTracks: 8, type: 'album' },
  { id: 'nr5', name: 'Echoes', imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop', artistId: 'a5', artistName: 'Sound Wave', releaseDate: '2024-01-05', totalTracks: 11, type: 'single' },
  { id: 'nr6', name: 'Neon Lights', imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop', artistId: 'a6', artistName: 'Synth City', releaseDate: '2024-01-03', totalTracks: 9, type: 'album' },
];

const popularArtists: Artist[] = [
  { id: 'pa1', name: 'The Weeknd', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', followers: 85000000 },
  { id: 'pa2', name: 'Dua Lipa', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', followers: 72000000 },
  { id: 'pa3', name: 'Drake', imageUrl: 'https://images.unsplash.com/photo-1571609860754-01dcc6c5da15?w=300&h=300&fit=crop', followers: 95000000 },
  { id: 'pa4', name: 'Taylor Swift', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop', followers: 110000000 },
  { id: 'pa5', name: 'Bad Bunny', imageUrl: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop', followers: 65000000 },
  { id: 'pa6', name: 'Billie Eilish', imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop', followers: 78000000 },
];

const recentlyPlayed: Playlist[] = [
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

export default function Home() {
  return (
    <div className="min-h-full pb-8">
      {/* Gradient Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-background pointer-events-none h-[332px]" />
        
        <div className="relative px-8 pt-8">
          <h1 className="text-3xl font-bold text-foreground mb-6" data-testid="text-greeting">
            {getGreeting()}
          </h1>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {featuredPlaylists.slice(0, 6).map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center gap-4 bg-card/60 rounded-md overflow-hidden hover-elevate cursor-pointer group"
                data-testid={`card-quick-${playlist.id}`}
              >
                <img 
                  src={playlist.imageUrl || ''} 
                  alt={playlist.name}
                  className="w-20 h-20 object-cover"
                />
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
        <CardRow title="Made For You">
          {recentlyPlayed.map((playlist) => (
            <MusicCard 
              key={playlist.id} 
              type="playlist" 
              data={playlist}
            />
          ))}
        </CardRow>

        <CardRow title="New Releases">
          {newReleases.map((album) => (
            <MusicCard 
              key={album.id} 
              type="album" 
              data={album}
            />
          ))}
        </CardRow>

        <CardRow title="Popular Artists">
          {popularArtists.map((artist) => (
            <MusicCard 
              key={artist.id} 
              type="artist" 
              data={artist}
            />
          ))}
        </CardRow>

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
