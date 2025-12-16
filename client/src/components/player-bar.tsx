import { usePlayer } from '@/lib/player-context';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1,
  Volume2, 
  VolumeX,
  Volume1,
  Mic2,
  ListMusic,
  Monitor,
  Maximize2,
  Heart
} from 'lucide-react';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function PlayerBar() {
  const { 
    state, 
    pause, 
    resume, 
    next, 
    previous, 
    seek, 
    setVolume, 
    toggleShuffle, 
    toggleRepeat 
  } = usePlayer();

  const { currentTrack, isPlaying, position, duration, volume, shuffle, repeat } = state;

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const handleSeek = (values: number[]) => {
    seek(values[0]);
  };

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-black border-t border-border px-4 flex items-center justify-between gap-4 z-50">
      {/* Left - Current Track Info */}
      <div className="flex items-center gap-3 min-w-[180px] max-w-[300px] flex-1">
        {currentTrack ? (
          <>
            <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 bg-muted">
              <img 
                src={currentTrack.albumImageUrl} 
                alt={currentTrack.albumName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate" data-testid="text-current-track">
                {currentTrack.name}
              </p>
              <p className="text-xs text-muted-foreground truncate" data-testid="text-current-artist">
                {currentTrack.artistName}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="flex-shrink-0 text-muted-foreground"
              data-testid="button-like-track"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">No track playing</div>
        )}
      </div>

      {/* Center - Playback Controls */}
      <div className="flex flex-col items-center gap-1 max-w-[722px] flex-1">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleShuffle}
            className={shuffle ? 'text-primary' : 'text-muted-foreground'}
            data-testid="button-shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={previous}
            className="text-muted-foreground"
            data-testid="button-previous"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </Button>
          <Button 
            size="icon"
            onClick={handlePlayPause}
            className="bg-white text-black rounded-full w-8 h-8"
            data-testid="button-play-pause"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={next}
            className="text-muted-foreground"
            data-testid="button-next"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleRepeat}
            className={repeat !== 'off' ? 'text-primary' : 'text-muted-foreground'}
            data-testid="button-repeat"
          >
            {repeat === 'track' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(position)}
          </span>
          <Slider
            value={[position]}
            max={duration || 100}
            step={1000}
            onValueChange={handleSeek}
            className="flex-1"
            data-testid="slider-progress"
          />
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right - Volume and Additional Controls */}
      <div className="flex items-center gap-2 min-w-[180px] max-w-[300px] flex-1 justify-end">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground"
          data-testid="button-now-playing-view"
        >
          <Mic2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground"
          data-testid="button-queue"
        >
          <ListMusic className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground"
          data-testid="button-devices"
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 w-32">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            className="text-muted-foreground flex-shrink-0"
            data-testid="button-volume"
          >
            <VolumeIcon className="w-4 h-4" />
          </Button>
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="flex-1"
            data-testid="slider-volume"
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground"
          data-testid="button-fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
