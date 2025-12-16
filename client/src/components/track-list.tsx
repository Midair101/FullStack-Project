import { usePlayer } from '@/lib/player-context';
import { Button } from '@/components/ui/button';
import { Play, Pause, MoreHorizontal, Clock } from 'lucide-react';
import type { Track } from '@shared/schema';

interface TrackListProps {
  tracks: Track[];
  showAlbum?: boolean;
  showHeader?: boolean;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function TrackList({ tracks, showAlbum = true, showHeader = true }: TrackListProps) {
  const { state, play, pause, resume } = usePlayer();
  const { currentTrack, isPlaying } = state;

  const handleTrackClick = (track: Track, index: number) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      play(track, tracks.slice(index));
    }
  };

  return (
    <div className="w-full">
      {showHeader && (
        <div className="grid grid-cols-[16px_minmax(120px,4fr)_minmax(120px,2fr)_minmax(120px,1fr)_minmax(40px,auto)] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border mb-2">
          <span className="text-center">#</span>
          <span>TITLE</span>
          {showAlbum && <span>ALBUM</span>}
          <span></span>
          <span className="flex justify-end">
            <Clock className="w-4 h-4" />
          </span>
        </div>
      )}

      <div className="space-y-0.5">
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isCurrentlyPlaying = isCurrentTrack && isPlaying;

          return (
            <div
              key={track.id}
              className={`group grid grid-cols-[16px_minmax(120px,4fr)_minmax(120px,2fr)_minmax(120px,1fr)_minmax(40px,auto)] gap-4 px-4 py-2 rounded-md hover-elevate cursor-pointer ${
                isCurrentTrack ? 'bg-accent' : ''
              }`}
              onClick={() => handleTrackClick(track, index)}
              data-testid={`row-track-${track.id}`}
            >
              {/* Track Number / Play Button */}
              <div className="flex items-center justify-center">
                <span className={`text-sm tabular-nums ${isCurrentTrack ? 'text-primary' : 'text-muted-foreground'} group-hover:hidden`}>
                  {isCurrentlyPlaying ? (
                    <div className="playing-animation">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    index + 1
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden group-hover:flex w-4 h-4 text-foreground"
                  data-testid={`button-play-track-${track.id}`}
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="w-3 h-3 fill-current" />
                  ) : (
                    <Play className="w-3 h-3 fill-current" />
                  )}
                </Button>
              </div>

              {/* Title and Artist */}
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  src={track.albumImageUrl} 
                  alt={track.albumName}
                  className="w-10 h-10 rounded-md flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className={`text-base font-medium truncate ${isCurrentTrack ? 'text-primary' : 'text-foreground'}`} data-testid={`text-track-name-${track.id}`}>
                    {track.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate" data-testid={`text-track-artist-${track.id}`}>
                    {track.explicit && (
                      <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-muted-foreground text-background rounded-sm mr-1">
                        E
                      </span>
                    )}
                    {track.artistName}
                  </p>
                </div>
              </div>

              {/* Album */}
              {showAlbum && (
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground truncate hover:text-foreground hover:underline" data-testid={`text-track-album-${track.id}`}>
                    {track.albumName}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground"
                  onClick={(e) => e.stopPropagation()}
                  data-testid={`button-track-options-${track.id}`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Duration */}
              <div className="flex items-center justify-end">
                <span className="text-sm text-muted-foreground tabular-nums" data-testid={`text-track-duration-${track.id}`}>
                  {formatDuration(track.durationMs)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
