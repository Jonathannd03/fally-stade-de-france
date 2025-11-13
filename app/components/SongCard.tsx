'use client';

import { useTranslations } from 'next-intl';
import { useAudio } from '../contexts/AudioContext';

type Song = {
  id: string;
  name: string;
  albumName: string;
  albumImage: string;
  previewUrl: string | null;
  deezerUrl: string;
  duration: number;
};

type SongCardProps = {
  song: Song;
  voteCount: number;
  hasVoted: boolean;
  onVote: (songId: string) => void;
  onUnvote: (songId: string) => void;
};

export default function SongCard({ song, voteCount, hasVoted, onVote, onUnvote }: SongCardProps) {
  const t = useTranslations('songCard');
  const { currentSongId, isPlaying, progress, toggle } = useAudio();

  const isCurrentSong = currentSongId === song.id;
  const isThisSongPlaying = isCurrentSong && isPlaying;

  const handlePlayClick = () => {
    if (song.previewUrl) {
      toggle(song.id, song.previewUrl);
    }
  };

  const handleVoteClick = () => {
    if (hasVoted) {
      onUnvote(song.id);
    } else {
      onVote(song.id);
    }
  };

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      className={`group relative bg-gradient-to-br from-zinc-900 to-black rounded-xl overflow-hidden border transition-all duration-300 ${
        isCurrentSong
          ? 'border-orange-500 shadow-lg shadow-orange-500/30'
          : 'border-zinc-800/50 hover:border-orange-500/50'
      }`}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-red-500/5 transition-opacity duration-300 ${
        isCurrentSong ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`} />

      {/* Progress bar at bottom */}
      {isCurrentSong && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800/50 z-10">
          <div
            className="h-full bg-gradient-to-r from-orange-600 to-red-600 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="relative p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 sm:gap-3">
              {/* Audio Visualizer (when playing) */}
              {isThisSongPlaying && (
                <div className="flex items-end gap-0.5 h-5 sm:h-6 pt-1 sm:pt-2 flex-shrink-0">
                  <div className="w-0.5 sm:w-1 bg-orange-500 rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0ms', animationDuration: '600ms' }} />
                  <div className="w-0.5 sm:w-1 bg-orange-500 rounded-full animate-pulse" style={{ height: '90%', animationDelay: '150ms', animationDuration: '600ms' }} />
                  <div className="w-0.5 sm:w-1 bg-orange-500 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '300ms', animationDuration: '600ms' }} />
                  <div className="w-0.5 sm:w-1 bg-orange-500 rounded-full animate-pulse" style={{ height: '80%', animationDelay: '450ms', animationDuration: '600ms' }} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-base sm:text-lg truncate mb-0.5 sm:mb-1 transition-colors ${
                  isCurrentSong ? 'text-orange-400' : 'text-white'
                }`}>
                  {song.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 truncate">
                  {song.albumName}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-0.5 sm:mt-1">
                  {formatDuration(song.duration)}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {/* Play/Pause Button or Spotify Link */}
              {song.previewUrl ? (
                <button
                  onClick={handlePlayClick}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                    isThisSongPlaying
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/30'
                  }`}
                >
                  {isThisSongPlaying ? (
                    <>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                      <span className="hidden sm:inline">{t('pause')}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span className="hidden sm:inline">{t('playPreview')}</span>
                    </>
                  )}
                </button>
              ) : (
                <a
                  href={song.deezerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-600 hover:to-green-600 text-white rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-lg shadow-emerald-500/30 flex-shrink-0"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.81 1.032v21.936L24 19.347V4.653z" />
                    <path d="M14.696 4.653v17.694l5.306-3.347V1.306z" />
                    <path d="M10.449 8.347v13.306l5.306-3.347V5z" />
                    <path d="M6.204 11.51v9.49l5.306-3.347V8.163z" />
                    <path d="M1.959 14.694v6.306L7.265 17.653v-6.326z" />
                  </svg>
                  <span className="hidden xs:inline">{t('listenDeezer')}</span>
                </a>
              )}

              {/* Vote Button */}
              <button
                onClick={handleVoteClick}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                  hasVoted
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:from-orange-500 hover:to-red-500'
                    : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {hasVoted ? (
                  <>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className="hidden xs:inline">{t('voted')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                    </svg>
                    <span className="hidden xs:inline">{t('vote')}</span>
                  </>
                )}
                <span className="px-1 sm:px-1.5 py-0.5 bg-black/30 rounded-full text-[10px] sm:text-xs">
                  {voteCount}
                </span>
              </button>

              {/* Playing indicator */}
              {isThisSongPlaying && (
                <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 text-xs text-orange-400 animate-pulse">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                  {t('nowPlaying')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
