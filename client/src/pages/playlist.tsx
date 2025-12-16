import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { TrackList } from '@/components/track-list';
import { usePlayer } from '@/lib/player-context';
import { Play, Pause, Heart, MoreHorizontal, Clock, Shuffle, Download } from 'lucide-react';
import type { Track, Playlist } from '@shared/schema';

const demoPlaylist: Playlist = {
  id: 'fp1',
  name: "Today's Top Hits",
  description: 'Taylor Swift is on top of the Hottest 50!',
  imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
  ownerId: 'spotify',
  ownerName: 'Spotify',
  isPublic: true,
  totalTracks: 50,
  followers: 33500000,
};

const demoTracks: Track[] = [
  { id: 't1', name: 'Blinding Lights', artistId: 'a1', artistName: 'The Weeknd', albumId: 'al1', albumName: 'After Hours', albumImageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', durationMs: 200000, trackNumber: 1, previewUrl: null, explicit: false, isPlayable: true },
  { id: 't2', name: 'Levitating', artistId: 'a2', artistName: 'Dua Lipa', albumId: 'al2', albumName: 'Future Nostalgia', albumImageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', durationMs: 203000, trackNumber: 2, previewUrl: null, explicit: false, isPlayable: true },
  { id: 't3', name: "God's Plan", artistId: 'a3', artistName: 'Drake', albumId: 'al3', albumName: 'Scorpion', albumImageUrl: 'https://images.unsplash.com/photo-1571609860754-01dcc6c5da15?w=300&h=300&fit=crop', durationMs: 198000, trackNumber: 3, previewUrl: null, explicit: true, isPlayable: true },
  { id: 't4', name: 'Anti-Hero', artistId: 'a4', artistName: 'Taylor Swift', albumId: 'al4', albumName: 'Midnights', albumImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop', durationMs: 200000, trackNumber: 4, previewUrl: null, explicit: false, isPlayable: true },
  { id: 't5', name: 'Flowers', artistId: 'a5', artistName: 'Miley Cyrus', albumId: 'al5', albumName: 'Endless Summer Vacation', albumImageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop', durationMs: 200000, trackNumber: 5, previewUrl: null, explicit: false, isPlayable: true },
  { id: 't6', name: 'Cruel Summer', artistId: 'a4', artistName: 'Taylor Swift', albumId: 'al6', albumName: 'Lover', albumImageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop', durationMs: 178000, trackNumber: 6, previewUrl: null, explicit: false, isPlayable: true },
  { id: 't7', name: 'Vampire', artistId: 'a6', artistName: 'Olivia Rodrigo', albumId: 'al7', albumName: 'GUTS', albumImageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop', durationMs: 219000, trackNumber: 7, previewUrl: null, explicit: true, isPlayable: true },
  { id: 't8', name: 'Paint The Town Red', artistId: 'a7', artistName: 'Doja Cat', albumId: 'al8', albumName: 'Scarlet', albumImageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop', durationMs: 231000, trackNumber: 8, previewUrl: null, explicit: true, isPlayable: true },
  { id: 't9', name: 'Strangers', artistId: 'a8', artistName: 'Kenya Grace', albumId: 'al9', albumName: 'Strangers', albumImageUrl: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop', durationMs: 172000, trackNumber: 9, previewUrl: null, explicit: false, isPlayable: true },
  { id: 't10', name: 'Water', artistId: 'a9', artistName: 'Tyla', albumId: 'al10', albumName: 'Water', albumImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop', durationMs: 193000, trackNumber: 10, previewUrl: null, explicit: false, isPlayable: true },
];

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function calculateTotalDuration(tracks: Track[]): string {
  const totalMs = tracks.reduce((acc, track) => acc + track.durationMs, 0);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  
  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  return `${minutes} min`;
}

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const { state, play, pause, resume } = usePlayer();
  const { currentTrack, isPlaying } = state;

  const playlist = demoPlaylist;
  const tracks = demoTracks;

  const isPlaylistPlaying = tracks.some(t => t.id === currentTrack?.id) && isPlaying;

  const handlePlayAll = () => {
    if (isPlaylistPlaying) {
      pause();
    } else if (tracks.some(t => t.id === currentTrack?.id)) {
      resume();
    } else if (tracks.length > 0) {
      play(tracks[0], tracks);
    }
  };

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-background pointer-events-none" />
        
        <div className="relative px-8 pt-16 pb-6 flex items-end gap-6">
          {/* Playlist Cover */}
          <div className="w-[232px] h-[232px] flex-shrink-0 rounded-md overflow-hidden shadow-2xl">
            {playlist.imageUrl ? (
              <img 
                src={playlist.imageUrl} 
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/50 to-primary/20 flex items-center justify-center">
                <Clock className="w-16 h-16 text-foreground/50" />
              </div>
            )}
          </div>

          {/* Playlist Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground mb-2">Playlist</p>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 truncate" data-testid="text-playlist-name">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-sm text-muted-foreground mb-2" data-testid="text-playlist-description">
                {playlist.description}
              </p>
            )}
            <div className="flex items-center gap-1 text-sm text-foreground">
              <span className="font-semibold" data-testid="text-playlist-owner">{playlist.ownerName}</span>
              {playlist.followers && (
                <>
                  <span className="text-muted-foreground mx-1">•</span>
                  <span className="text-muted-foreground">{formatNumber(playlist.followers)} likes</span>
                </>
              )}
              <span className="text-muted-foreground mx-1">•</span>
              <span className="text-muted-foreground" data-testid="text-playlist-stats">
                {playlist.totalTracks} songs, {calculateTotalDuration(tracks)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-8 py-6 flex items-center gap-6">
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground"
          onClick={handlePlayAll}
          data-testid="button-play-playlist"
        >
          {isPlaylistPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-1" />
          )}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground"
          data-testid="button-shuffle-playlist"
        >
          <Shuffle className="w-8 h-8" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground"
          data-testid="button-like-playlist"
        >
          <Heart className="w-8 h-8" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground"
          data-testid="button-download-playlist"
        >
          <Download className="w-8 h-8" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground"
          data-testid="button-more-playlist"
        >
          <MoreHorizontal className="w-8 h-8" />
        </Button>
      </div>

      {/* Track List */}
      <div className="px-4 pb-32">
        <TrackList tracks={tracks} />
      </div>
    </div>
  );
}
