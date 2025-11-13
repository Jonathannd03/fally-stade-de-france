'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SongCard from './SongCard';

type Song = {
  id: string;
  name: string;
  albumName: string;
  albumImage: string;
  previewUrl: string | null;
  deezerUrl: string;
  duration: number;
};

type AlbumSectionProps = {
  albumName: string;
  albumImage: string;
  songs: Song[];
  voteCounts: Record<string, number>;
  userVotes: Set<string>;
  onVote: (songId: string) => void;
  onUnvote: (songId: string) => void;
};

export default function AlbumSection({
  albumName,
  albumImage,
  songs,
  voteCounts,
  userVotes,
  onVote,
  onUnvote,
}: AlbumSectionProps) {
  const t = useTranslations('voting');
  const [isExpanded, setIsExpanded] = useState(false);

  const totalVotes = songs.reduce((sum, song) => sum + (voteCounts[song.id] || 0), 0);

  return (
    <div className="bg-gray-100 dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-300 dark:border-zinc-800 backdrop-blur-sm">
      {/* Album Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center gap-6 hover:bg-gray-200 dark:hover:bg-zinc-800/50 transition-all duration-300 group"
      >
        {/* Album Cover */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden shadow-lg shadow-black/50 group-hover:shadow-orange-500/30 transition-shadow duration-300">
          <Image
            src={albumImage}
            alt={albumName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Album Info */}
        <div className="flex-1 text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
            {albumName}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              {songs.length} {songs.length === 1 ? t('song') : t('songs')}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
              </svg>
              {totalVotes} {totalVotes === 1 ? t('vote') : t('votes')}
            </span>
          </div>
        </div>

        {/* Expand Icon */}
        <div className={`flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </div>
      </button>

      {/* Songs List */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 pt-0 space-y-3">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              voteCount={voteCounts[song.id] || 0}
              hasVoted={userVotes.has(song.id)}
              onVote={onVote}
              onUnvote={onUnvote}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
