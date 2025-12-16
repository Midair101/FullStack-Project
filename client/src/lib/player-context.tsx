import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import type { Track, PlayerState } from '@shared/schema';

interface PlayerContextType {
  state: PlayerState;
  play: (track: Track, queue?: Track[]) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (position: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
}

const defaultState: PlayerState = {
  isPlaying: false,
  currentTrack: null,
  queue: [],
  position: 0,
  duration: 0,
  volume: 0.7,
  shuffle: false,
  repeat: 'off',
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>(defaultState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = state.volume;

    audioRef.current.addEventListener('ended', () => {
      if (state.repeat === 'track') {
        audioRef.current?.play();
      } else {
        next();
      }
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state.isPlaying) {
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setState(prev => ({
            ...prev,
            position: audioRef.current?.currentTime ? audioRef.current.currentTime * 1000 : 0,
          }));
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isPlaying]);

  const play = useCallback((track: Track, queue?: Track[]) => {
    if (audioRef.current && track.previewUrl) {
      audioRef.current.src = track.previewUrl;
      audioRef.current.play().catch(console.error);
    }
    setState(prev => ({
      ...prev,
      isPlaying: true,
      currentTrack: track,
      queue: queue || prev.queue,
      position: 0,
      duration: track.durationMs,
    }));
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play().catch(console.error);
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const next = useCallback(() => {
    setState(prev => {
      const currentIndex = prev.queue.findIndex(t => t.id === prev.currentTrack?.id);
      let nextIndex = currentIndex + 1;
      
      if (prev.shuffle) {
        nextIndex = Math.floor(Math.random() * prev.queue.length);
      }
      
      if (nextIndex >= prev.queue.length) {
        if (prev.repeat === 'context') {
          nextIndex = 0;
        } else {
          return { ...prev, isPlaying: false };
        }
      }

      const nextTrack = prev.queue[nextIndex];
      if (nextTrack && audioRef.current && nextTrack.previewUrl) {
        audioRef.current.src = nextTrack.previewUrl;
        audioRef.current.play().catch(console.error);
      }

      return {
        ...prev,
        currentTrack: nextTrack || null,
        position: 0,
        duration: nextTrack?.durationMs || 0,
      };
    });
  }, []);

  const previous = useCallback(() => {
    setState(prev => {
      if (prev.position > 3000) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
        return { ...prev, position: 0 };
      }

      const currentIndex = prev.queue.findIndex(t => t.id === prev.currentTrack?.id);
      const prevIndex = currentIndex - 1;
      
      if (prevIndex < 0) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
        return { ...prev, position: 0 };
      }

      const prevTrack = prev.queue[prevIndex];
      if (prevTrack && audioRef.current && prevTrack.previewUrl) {
        audioRef.current.src = prevTrack.previewUrl;
        audioRef.current.play().catch(console.error);
      }

      return {
        ...prev,
        currentTrack: prevTrack || null,
        position: 0,
        duration: prevTrack?.durationMs || 0,
      };
    });
  }, []);

  const seek = useCallback((position: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = position / 1000;
    }
    setState(prev => ({ ...prev, position }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    setState(prev => ({ ...prev, volume }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState(prev => ({
      ...prev,
      repeat: prev.repeat === 'off' ? 'context' : prev.repeat === 'context' ? 'track' : 'off',
    }));
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setState(prev => ({ ...prev, queue: [...prev.queue, track] }));
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        state,
        play,
        pause,
        resume,
        next,
        previous,
        seek,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
