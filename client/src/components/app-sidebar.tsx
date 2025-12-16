import { Link, useLocation } from 'wouter';
import { Home, Search, Library, Plus, Heart, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Playlist } from '@shared/schema';

const demoPlaylists: Playlist[] = [
  { id: '1', name: 'Liked Songs', description: 'Your liked songs', imageUrl: null, ownerId: '1', ownerName: 'You', isPublic: false, totalTracks: 142 },
  { id: '2', name: 'Discover Weekly', description: 'Your personal mixtape', imageUrl: null, ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 30 },
  { id: '3', name: 'Release Radar', description: 'New music from artists you follow', imageUrl: null, ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 30 },
  { id: '4', name: 'Daily Mix 1', description: 'Your daily mix', imageUrl: null, ownerId: 'spotify', ownerName: 'Spotify', isPublic: true, totalTracks: 50 },
  { id: '5', name: 'Chill Vibes', description: 'Relaxing tunes', imageUrl: null, ownerId: '1', ownerName: 'You', isPublic: false, totalTracks: 25 },
  { id: '6', name: 'Workout Mix', description: 'Energy boost', imageUrl: null, ownerId: '1', ownerName: 'You', isPublic: false, totalTracks: 45 },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
          <Music className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Gotify</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 space-y-1">
        <Link href="/" data-testid="link-home">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-4 text-base font-semibold ${
              location === '/' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            <Home className="w-6 h-6" />
            Home
          </Button>
        </Link>
        <Link href="/search" data-testid="link-search">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-4 text-base font-semibold ${
              location === '/search' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            <Search className="w-6 h-6" />
            Search
          </Button>
        </Link>
      </nav>

      {/* Library Section */}
      <div className="mt-6 flex-1 flex flex-col min-h-0">
        <div className="px-3">
          <div className="flex items-center justify-between gap-2 py-2">
            <Button
              variant="ghost"
              className="justify-start gap-4 text-base font-semibold text-muted-foreground flex-1"
              data-testid="button-library"
            >
              <Library className="w-6 h-6" />
              Your Library
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground"
              data-testid="button-create-playlist"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Playlist List */}
        <ScrollArea className="flex-1 px-2 scrollbar-thin">
          <div className="space-y-1 pb-4">
            {/* Liked Songs Special Card */}
            <Link href="/playlist/liked" data-testid="link-liked-songs">
              <div className="flex items-center gap-3 p-2 rounded-md hover-elevate cursor-pointer group">
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">Liked Songs</p>
                  <p className="text-xs text-muted-foreground truncate">Playlist • 142 songs</p>
                </div>
              </div>
            </Link>

            {/* Other Playlists */}
            {demoPlaylists.slice(1).map((playlist) => (
              <Link 
                key={playlist.id} 
                href={`/playlist/${playlist.id}`}
                data-testid={`link-playlist-${playlist.id}`}
              >
                <div className="flex items-center gap-3 p-2 rounded-md hover-elevate cursor-pointer group">
                  <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                    <Music className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{playlist.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Playlist • {playlist.ownerName}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
