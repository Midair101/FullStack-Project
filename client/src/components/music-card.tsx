import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Album, Playlist, Artist } from '@shared/schema';

interface MusicCardProps {
  type: 'album' | 'playlist' | 'artist';
  data: Album | Playlist | Artist;
  onPlay?: () => void;
  onClick?: () => void;
}

export function MusicCard({ type, data, onPlay, onClick }: MusicCardProps) {
  const isArtist = type === 'artist';
  const artist = data as Artist;
  const album = data as Album;
  const playlist = data as Playlist;

  const imageUrl = 
    type === 'artist' ? artist.imageUrl :
    type === 'album' ? album.imageUrl :
    playlist.imageUrl;

  const title = data.name;

  const subtitle = 
    type === 'artist' ? 'Artist' :
    type === 'album' ? album.artistName :
    `By ${playlist.ownerName}`;

  return (
    <div 
      className="group p-4 rounded-md bg-card hover-elevate cursor-pointer transition-colors duration-200"
      onClick={onClick}
      data-testid={`card-${type}-${data.id}`}
    >
      <div className="relative mb-4">
        <div 
          className={`aspect-square w-full overflow-hidden ${
            isArtist ? 'rounded-full' : 'rounded-md'
          } bg-muted`}
        >
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900">
              <span className="text-4xl font-bold text-muted-foreground">
                {title.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        {/* Play Button Overlay */}
        <Button
          size="icon"
          className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.();
          }}
          data-testid={`button-play-${type}-${data.id}`}
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </Button>
      </div>

      <h3 className="font-semibold text-foreground truncate mb-1" data-testid={`text-title-${data.id}`}>
        {title}
      </h3>
      <p className="text-sm text-muted-foreground truncate" data-testid={`text-subtitle-${data.id}`}>
        {subtitle}
      </p>
    </div>
  );
}

interface CardRowProps {
  title: string;
  children: React.ReactNode;
  seeAllHref?: string;
}

export function CardRow({ title, children, seeAllHref }: CardRowProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold text-foreground" data-testid={`text-section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {title}
        </h2>
        {seeAllHref && (
          <a 
            href={seeAllHref}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground hover:underline"
            data-testid={`link-see-all-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            Show all
          </a>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {children}
      </div>
    </section>
  );
}
