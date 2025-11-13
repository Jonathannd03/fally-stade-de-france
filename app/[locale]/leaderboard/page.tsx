'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAudio } from '../../contexts/AudioContext';
import Navbar from '../../components/Navbar';
import PrototypeBanner from '../../components/PrototypeBanner';
import PageViewTracker from '../../components/PageViewTracker';
import Footer from '../../components/Footer';

type Song = {
  id: string;
  name: string;
  albumName: string;
  albumImage: string;
  previewUrl: string | null;
  deezerUrl: string;
  duration: number;
};

type SongWithVotes = Song & {
  votes: number;
};

export default function Leaderboard() {
  const t = useTranslations('leaderboard');
  const tSong = useTranslations('songCard');
  const [topSongs, setTopSongs] = useState<SongWithVotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);
  const { currentSongId, isPlaying, toggle } = useAudio();

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        // Fetch all songs
        const songsRes = await fetch('/api/songs');
        const songsData = await songsRes.json();

        // Fetch all votes
        const votesRes = await fetch('/api/votes');
        const votesData = await votesRes.json();

        if (songsData.success && votesData.success) {
          const songs: Song[] = songsData.data;
          const voteCounts: Record<string, number> = votesData.data;

          // Combine songs with vote counts and sort - LIMIT TO TOP 5
          const songsWithVotes: SongWithVotes[] = songs
            .map((song) => ({
              ...song,
              votes: voteCounts[song.id] || 0,
            }))
            .filter((song) => song.votes > 0)
            .sort((a, b) => b.votes - a.votes)
            .slice(0, 5); // Only show top 5

          setTopSongs(songsWithVotes);

          // Calculate total votes
          const total = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);
          setTotalVotes(total);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-gray-300 animate-pulse">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Page View Tracker */}
      <PageViewTracker />

      {/* Navigation */}
      <Navbar />

      {/* Prototype Banner */}
      <PrototypeBanner />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Flying Eagles */}
        <div className="absolute top-40 left-20 animate-float">
          <svg className="w-16 h-16 text-orange-500/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 9l3 2 7-5 7 5 3-2L12 2z" />
          </svg>
        </div>
        <div className="absolute bottom-60 right-32 animate-float" style={{ animationDelay: '2s', animationDuration: '4s' }}>
          <svg className="w-20 h-20 text-red-500/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 9l3 2 7-5 7 5 3-2L12 2z" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="relative pt-20 sm:pt-24 border-b border-zinc-800/50 backdrop-blur-xl bg-zinc-900/50">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
          <div className="text-center mb-4 sm:mb-6">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-300 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              {t('badge')}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-500 via-red-600 to-orange-600 bg-clip-text text-transparent mb-1.5 sm:mb-2 px-2">
              {t('title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 font-light mb-1.5 sm:mb-2 px-2">
              {t('subtitle')}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 px-2">
              {t('note')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2 text-gray-300">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
              </svg>
              <span className="text-sm sm:text-base md:text-lg font-semibold text-orange-500">{totalVotes}</span> {t('totalVotes')}
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 sm:gap-2 text-gray-300">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm sm:text-base md:text-lg font-semibold text-red-500">{t('topFive')}</span> {t('publicLeaderboard')}
            </span>
          </div>
        </div>
      </header>

      {/* Back Button */}
      <div className="relative container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/50 text-gray-300 hover:text-white rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{t('backToVoting')}</span>
        </Link>
      </div>

      {/* Leaderboard */}
      <div className="relative container mx-auto px-3 sm:px-4 pb-6 sm:pb-8 md:pb-12">
        <div className="bg-zinc-900 backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
          {topSongs.length === 0 ? (
            <div className="p-8 sm:p-12 md:p-16 text-center">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-zinc-700 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-400 text-base sm:text-lg">{t('noVotes')}</p>
              <p className="text-gray-600 text-xs sm:text-sm mt-1.5 sm:mt-2">{t('beFirst')}</p>
            </div>
          ) : (
            <>
            <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 p-3 sm:p-4 md:p-6 border-b border-orange-500/30 dark:border-orange-500/20">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <p className="text-gray-300 text-center text-xs sm:text-sm md:text-base">
                  <span className="font-semibold text-white">{t('topFiveRankings')}</span> - {t('fullAnalytics')}
                </p>
              </div>
            </div>
            <div>
            {topSongs.map((song, index) => {
              const percentage = totalVotes > 0 ? (song.votes / totalVotes) * 100 : 0;
              const isTopThree = index < 3;

                return (
                  <div
                    key={song.id}
                    className={`group relative flex items-center gap-1.5 sm:gap-3 md:gap-4 p-2 sm:p-4 md:p-6 border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800/50 transition-all duration-300 ${
                      isTopThree ? 'bg-gradient-to-r from-transparent via-orange-500/5 to-transparent' : ''
                    }`}
                  >
                    {/* Background Progress Bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-600/10 to-transparent transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />

                    {/* Rank */}
                    <div className="relative flex-shrink-0 w-8 sm:w-12 md:w-16 text-center">
                      {index < 3 ? (
                        <div className="text-xl sm:text-3xl md:text-4xl">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                        </div>
                      ) : (
                        <div className="text-base sm:text-xl md:text-2xl font-bold text-zinc-600">
                          #{index + 1}
                        </div>
                      )}
                    </div>

                    {/* Album Art */}
                    {song.albumImage && (
                      <div className="relative flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-md sm:rounded-lg overflow-hidden shadow-lg group-hover:shadow-orange-500/30 transition-shadow">
                        <Image
                          src={song.albumImage}
                          alt={song.albumName}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Song Info */}
                    <div className="relative flex-1 min-w-0">
                      <h3 className="font-bold text-xs sm:text-base md:text-lg text-white truncate mb-0.5 sm:mb-1 group-hover:text-orange-400 transition-colors">
                        {song.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 truncate hidden sm:block">
                        {song.albumName}
                      </p>

                      {/* Vote Progress Bar */}
                      <div className="mt-1.5 sm:mt-2 md:mt-3 hidden sm:block">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1">
                          <div className="flex-1 h-1.5 sm:h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isTopThree
                                  ? 'bg-gradient-to-r from-orange-600 to-red-600'
                                  : 'bg-gradient-to-r from-zinc-600 to-zinc-700'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-400 min-w-[2.5rem] sm:min-w-[3rem] text-right">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Vote Count */}
                    <div className="relative flex-shrink-0 text-center px-1.5 sm:px-4 md:px-6">
                      <div className={`text-base sm:text-2xl md:text-3xl font-bold ${
                        isTopThree
                          ? 'bg-gradient-to-br from-orange-500 to-red-500 bg-clip-text text-transparent'
                          : 'text-gray-400'
                      }`}>
                        {song.votes}
                      </div>
                      <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">
                        {song.votes === 1 ? t('vote') : t('votes')}
                      </div>
                    </div>

                    {/* Play Button */}
                    {song.previewUrl && (
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() => toggle(song.id, song.previewUrl!)}
                          className={`p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-200 shadow-lg ${
                            currentSongId === song.id && isPlaying
                              ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-orange-500/50'
                              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 shadow-orange-500/30 hover:shadow-orange-500/50'
                          } text-white`}
                          title={currentSongId === song.id && isPlaying ? tSong('pause') : tSong('playPreview')}
                        >
                          {currentSongId === song.id && isPlaying ? (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
