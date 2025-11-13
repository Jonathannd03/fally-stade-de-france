'use client';

import { useAudio } from '../contexts/AudioContext';
import { useState, useEffect } from 'react';

type Song = {
  id: string;
  name: string;
  albumName: string;
  albumImage: string;
  previewUrl: string | null;
  deezerUrl: string;
  duration: number;
};

type FloatingPlayerProps = {
  songs: Song[];
};

export default function FloatingPlayer({ songs }: FloatingPlayerProps) {
  const { currentSongId, isPlaying, progress, currentTime, duration, pause, toggle, seek } = useAudio();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  useEffect(() => {
    if (currentSongId) {
      const song = songs.find((s) => s.id === currentSongId);
      if (song) {
        setCurrentSong(song);
      }
    } else {
      setCurrentSong(null);
    }
  }, [currentSongId, songs]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = percent * duration;
    seek(newTime);
  };

  if (!currentSong) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ${
      currentSongId ? 'translate-y-0' : 'translate-y-full'
    }`}>
      {/* Progress Bar (clickable) */}
      <div
        className="h-1 bg-zinc-800 cursor-pointer group relative"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-gradient-to-r from-orange-600 to-red-600 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Player Controls */}
      <div className="bg-zinc-900 border-t border-zinc-800 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Audio Visualizer */}
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-10">
                <div className="w-1 bg-orange-500 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0ms', animationDuration: '500ms' }} />
                <div className="w-1 bg-orange-500 rounded-full animate-pulse" style={{ height: '70%', animationDelay: '100ms', animationDuration: '500ms' }} />
                <div className="w-1 bg-orange-500 rounded-full animate-pulse" style={{ height: '50%', animationDelay: '200ms', animationDuration: '500ms' }} />
                <div className="w-1 bg-orange-500 rounded-full animate-pulse" style={{ height: '90%', animationDelay: '300ms', animationDuration: '500ms' }} />
                <div className="w-1 bg-orange-500 rounded-full animate-pulse" style={{ height: '60%', animationDelay: '400ms', animationDuration: '500ms' }} />
              </div>
            )}

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold truncate text-sm">
                {currentSong.name}
              </h4>
              <p className="text-gray-400 text-xs truncate">
                {currentSong.albumName}
              </p>
            </div>

            {/* Time Display */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={() => currentSong.previewUrl && toggle(currentSong.id, currentSong.previewUrl)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-200"
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={pause}
              className="w-8 h-8 rounded-full hover:bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
              title="Stop playback"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
