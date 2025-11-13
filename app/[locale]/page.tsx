'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import PrototypeBanner from '../components/PrototypeBanner';
import PageViewTracker from '../components/PageViewTracker';
import EventHero from '../components/EventHero';
import AboutEvent from '../components/AboutEvent';
import VotingStats from '../components/VotingStats';
import AlbumSection from '../components/AlbumSection';
import FloatingPlayer from '../components/FloatingPlayer';
import Footer from '../components/Footer';

type Song = {
  id: string;
  name: string;
  albumName: string;
  albumImage: string;
  previewUrl: string | null;
  deezerUrl: string;
  duration: number;
};

type AlbumGroup = {
  albumName: string;
  albumImage: string;
  songs: Song[];
};

export default function Home() {
  const tVoting = useTranslations('voting');
  const tLoading = useTranslations('loading');
  const [songs, setSongs] = useState<Song[]>([]);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'votes' | 'album'>('votes');

  // Generate or retrieve user ID
  useEffect(() => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = `user_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('userId', id);
    }
    setUserId(id);
  }, []);

  // Fetch songs and votes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch songs from Deezer
        const songsRes = await fetch('/api/songs');
        const songsData = await songsRes.json();

        if (songsData.success) {
          setSongs(songsData.data);
        }

        // Fetch all votes
        const votesRes = await fetch('/api/votes');
        const votesData = await votesRes.json();

        if (votesData.success) {
          setVoteCounts(votesData.data);
        }

        // Fetch user's votes
        if (userId) {
          const userVotesRes = await fetch(`/api/votes/user?userId=${userId}`);
          const userVotesData = await userVotesRes.json();

          if (userVotesData.success) {
            setUserVotes(new Set(userVotesData.data));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleVote = async (songId: string) => {
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId, userId }),
      });

      const data = await res.json();

      if (data.success) {
        setUserVotes((prev) => new Set([...prev, songId]));
        setVoteCounts((prev) => ({
          ...prev,
          [songId]: (prev[songId] || 0) + 1,
        }));
      } else {
        alert(data.error || 'Failed to cast vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to cast vote');
    }
  };

  const handleUnvote = async (songId: string) => {
    try {
      const res = await fetch(`/api/votes?songId=${songId}&userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setUserVotes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(songId);
          return newSet;
        });
        setVoteCounts((prev) => ({
          ...prev,
          [songId]: Math.max((prev[songId] || 0) - 1, 0),
        }));
      } else {
        alert(data.error || 'Failed to remove vote');
      }
    } catch (error) {
      console.error('Error unvoting:', error);
      alert('Failed to remove vote');
    }
  };

  // Group songs by album
  const groupedAlbums = songs.reduce((acc, song) => {
    const existing = acc.find((album) => album.albumName === song.albumName);
    if (existing) {
      existing.songs.push(song);
    } else {
      acc.push({
        albumName: song.albumName,
        albumImage: song.albumImage,
        songs: [song],
      });
    }
    return acc;
  }, [] as AlbumGroup[]);

  // Filter albums by search term
  const filteredAlbums = groupedAlbums
    .map((album) => ({
      ...album,
      songs: album.songs.filter(
        (song) =>
          song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.albumName.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((album) => album.songs.length > 0);

  // Sort albums
  const sortedAlbums = [...filteredAlbums].sort((a, b) => {
    switch (sortBy) {
      case 'votes': {
        const aVotes = a.songs.reduce((sum, song) => sum + (voteCounts[song.id] || 0), 0);
        const bVotes = b.songs.reduce((sum, song) => sum + (voteCounts[song.id] || 0), 0);
        return bVotes - aVotes;
      }
      case 'name':
        return a.albumName.localeCompare(b.albumName);
      case 'album':
        return a.albumName.localeCompare(b.albumName);
      default:
        return 0;
    }
  });

  const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);
  const totalSongs = songs.length;
  const userVotesCount = userVotes.size;

  // Get top album by votes
  const topAlbum = sortedAlbums[0]?.albumName;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-gray-300 animate-pulse">{tLoading('catalog')}</p>
          <p className="text-sm text-gray-500 mt-2">{tLoading('experience')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Page View Tracker */}
      <PageViewTracker />

      {/* Navigation Bar */}
      <Navbar />

      {/* Prototype Banner */}
      <PrototypeBanner />

      {/* Event Hero Section */}
      <EventHero />

      {/* About Event Section */}
      <AboutEvent />

      {/* Voting Statistics */}
      <VotingStats
        totalSongs={totalSongs}
        totalVotes={totalVotes}
        userVotes={userVotesCount}
        topAlbumName={topAlbum}
      />

      {/* Quick Actions Bar */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-zinc-800/50 shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap justify-center sm:justify-start">
              <h2 className="text-sm sm:text-base md:text-xl font-bold text-white text-center sm:text-left">
                {tVoting('stickyTitle')} <span className="text-orange-500">{tVoting('stickyTitleHighlight')}</span>
              </h2>
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-300 text-xs sm:text-sm font-semibold">
                {userVotesCount} {userVotesCount === 1 ? tVoting('voteCast') : tVoting('votesCast')} {tVoting('cast')}
              </span>
            </div>
            <Link
              href="/leaderboard"
              className="group flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 font-medium text-xs sm:text-sm md:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z" />
              </svg>
              <span className="whitespace-nowrap">View Leaderboard</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Voting Section */}
      <div id="voting-section" className="relative bg-black py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Section Header */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              {tVoting('sectionTitle')} <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">{tVoting('sectionTitleHighlight')}</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-2">
              {tVoting('sectionDescription')}
              <span className="block mt-1 sm:mt-2 text-orange-400 font-semibold text-xs sm:text-sm">{tVoting('sectionNote')}</span>
            </p>
          </div>

          {/* Controls */}
          <div className="bg-zinc-900 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-zinc-800 shadow-xl mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <svg className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={tVoting('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-black border border-zinc-800 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'votes' | 'album')}
                  className="appearance-none w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 pr-9 sm:pr-10 bg-black border border-zinc-800 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none cursor-pointer"
                >
                  <option value="votes">{tVoting('sortMostVoted')}</option>
                  <option value="name">{tVoting('sortAZ')}</option>
                  <option value="album">{tVoting('sortAlbum')}</option>
                </select>
                <svg className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
              <div className="text-gray-400">
                {tVoting('showing')} <span className="text-orange-500 font-semibold">{sortedAlbums.reduce((sum, album) => sum + album.songs.length, 0)}</span> {tVoting('songs')} {tVoting('in')} <span className="text-orange-500 font-semibold">{sortedAlbums.length}</span> {tVoting('albums')}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-orange-400">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
                <span className="text-[10px] sm:text-xs">{tVoting('clickPreview')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Albums Grid */}
      <div className="relative bg-black pb-6 sm:pb-8 md:pb-12">
        <div className="container mx-auto px-3 sm:px-4">
        <div className="space-y-3 sm:space-y-4">
          {sortedAlbums.map((album) => (
            <AlbumSection
              key={album.albumName}
              albumName={album.albumName}
              albumImage={album.albumImage}
              songs={album.songs}
              voteCounts={voteCounts}
              userVotes={userVotes}
              onVote={handleVote}
              onUnvote={handleUnvote}
            />
          ))}
        </div>

        {sortedAlbums.length === 0 && (
          <div className="text-center py-8 sm:py-12 md:py-16">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-zinc-700 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-base sm:text-lg">{tVoting('noResults')}</p>
            <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">{tVoting('tryDifferent')}</p>
          </div>
        )}
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating Audio Player */}
      <FloatingPlayer songs={songs} />
    </div>
  );
}
