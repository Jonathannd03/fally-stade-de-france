'use client';

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';

type AudioContextType = {
  currentSongId: string | null;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  play: (songId: string, previewUrl: string) => void;
  pause: () => void;
  toggle: (songId: string, previewUrl: string) => void;
  seek: (time: number) => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();

    const audio = audioRef.current;

    // Update progress and time
    const handleTimeUpdate = () => {
      if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        setProgress(percent);
        setCurrentTime(audio.currentTime);
      }
    };

    // Handle when song ends
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    // Update duration when loaded
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    // Handle play/pause events
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
    };
  }, []);

  const play = (songId: string, previewUrl: string) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    // If it's a different song, load and play it
    if (currentSongId !== songId) {
      audio.src = previewUrl;
      audio.play();
      setCurrentSongId(songId);
      setProgress(0);
      setCurrentTime(0);
    } else {
      // Same song, just play
      audio.play();
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  };

  const toggle = (songId: string, previewUrl: string) => {
    if (currentSongId === songId && isPlaying) {
      pause();
    } else {
      play(songId, previewUrl);
    }
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  };

  return (
    <AudioContext.Provider
      value={{
        currentSongId,
        isPlaying,
        progress,
        currentTime,
        duration,
        play,
        pause,
        toggle,
        seek,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
