'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../contexts/AuthContext';

type Song = {
  id: string;
  name: string;
  albumName: string;
  albumImage: string;
  previewUrl: string | null;
  deezerUrl: string;
  duration: number;
};

type AnalyticsData = {
  overview: {
    totalVotes: number;
    uniqueVoters: number;
    totalSongsWithVotes: number;
    avgVotesPerSong: number;
    votesLast24h: number;
    votesLast7Days: number;
  };
  topSongs: Array<{
    songId: string;
    votes: number;
    voteDetails: Array<{ userId: string; timestamp: string }>;
  }>;
  voteCounts: Record<string, number>;
  votesPerDay: Record<string, number>;
  voteDistribution: Record<number, number>;
  topVoters: Array<{ userId: string; votes: number }>;
  recentActivity: Array<{ songId: string; userId: string; timestamp: string }>;
  lastUpdated: string;
};

export default function AdminDashboard() {
  const t = useTranslations('admin');
  const tVoting = useTranslations('voting');
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'songs' | 'voters' | 'activity'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'votes' | 'name' | 'album'>('votes');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // Fetch analytics
      const analyticsRes = await fetch('/api/analytics');
      const analyticsData = await analyticsRes.json();

      // Fetch songs
      const songsRes = await fetch('/api/songs');
      const songsData = await songsRes.json();

      if (analyticsData.success && songsData.success) {
        setAnalytics(analyticsData.data);
        setSongs(songsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!analytics || !songs) return;

    const songsWithVotes = songs
      .map((song) => ({
        name: song.name,
        album: song.albumName,
        votes: analytics.voteCounts[song.id] || 0,
      }))
      .sort((a, b) => b.votes - a.votes);

    const csvContent = [
      ['Song Name', 'Album', 'Votes'],
      ...songsWithVotes.map((song) => [
        song.name,
        song.album,
        song.votes.toString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fally-ipupa-voting-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSongById = (songId: string) => songs.find((s) => s.id === songId);

  const getSongsWithVotes = () => {
    return songs
      .map((song) => ({
        ...song,
        votes: analytics?.voteCounts[song.id] || 0,
      }))
      .filter((song) =>
        searchTerm
          ? song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.albumName.toLowerCase().includes(searchTerm.toLowerCase())
          : true
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'votes':
            return b.votes - a.votes;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'album':
            return a.albumName.localeCompare(b.albumName);
          default:
            return 0;
        }
      });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getVoteTrend = () => {
    if (!analytics) return 0;
    const { votesLast24h, votesLast7Days } = analytics.overview;
    const avgPerDay = votesLast7Days / 7;
    const trend = ((votesLast24h - avgPerDay) / avgPerDay) * 100;
    return trend;
  };

  // Show loading while checking authentication
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-orange-500/40 dark:border-orange-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 animate-pulse">{t('loadingAnalytics')}</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Failed to load analytics</p>
      </div>
    );
  }

  const songsWithVotes = getSongsWithVotes();
  const voteTrend = getVoteTrend();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-gray-300 dark:border-zinc-800/50 backdrop-blur-xl bg-gray-100 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mb-2">
                {t('title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-gray-200 dark:bg-zinc-900 hover:bg-gray-300 dark:hover:bg-zinc-800 border border-gray-300 dark:border-zinc-800 hover:border-orange-500/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('refresh')}
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-orange-500/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('exportCSV')}
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-200 dark:bg-zinc-900 hover:bg-gray-300 dark:hover:bg-zinc-800 border border-gray-300 dark:border-zinc-800 hover:border-red-500/50 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t('logout')}
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-gray-200 dark:bg-zinc-900 hover:bg-gray-300 dark:hover:bg-zinc-800 border border-gray-300 dark:border-zinc-800 hover:border-orange-500/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all duration-300"
              >
                {t('backToSite')}
              </Link>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-gray-500">
            {t('lastUpdated')} {formatDate(analytics.lastUpdated)}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-300 dark:border-zinc-800/50">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 py-4">
            {[
              { id: 'overview', label: t('tabOverview'), icon: '📊' },
              { id: 'songs', label: t('tabSongs'), icon: '🎵' },
              { id: 'voters', label: t('tabVoters'), icon: '👥' },
              { id: 'activity', label: t('tabActivity'), icon: '⚡' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gray-200 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Votes */}
              <div className="bg-gray-100 dark:bg-zinc-900 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                    </svg>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    voteTrend > 0
                      ? 'bg-green-500/20 text-green-400'
                      : voteTrend < 0
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {voteTrend > 0 ? '↑' : voteTrend < 0 ? '↓' : '→'} {Math.abs(voteTrend).toFixed(1)}%
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {analytics.overview.totalVotes.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalVotesCast')}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {analytics.overview.votesLast24h} {t('inLast24h')}
                </div>
              </div>

              {/* Unique Voters */}
              <div className="bg-gray-100 dark:bg-zinc-900 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {analytics.overview.uniqueVoters.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('uniqueVoters')}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {(analytics.overview.totalVotes / analytics.overview.uniqueVoters).toFixed(1)} {t('avgVotesPerUser')}
                </div>
              </div>

              {/* Songs with Votes */}
              <div className="bg-gray-100 dark:bg-zinc-900 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {analytics.overview.totalSongsWithVotes}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('songsWithVotes')}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {((analytics.overview.totalSongsWithVotes / songs.length) * 100).toFixed(1)}% {t('ofCatalog')}
                </div>
              </div>

              {/* Average Votes */}
              <div className="bg-gray-100 dark:bg-zinc-900 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {analytics.overview.avgVotesPerSong.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('avgVotesPerSong')}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {analytics.overview.votesLast7Days} {t('votesLast7Days')}
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Votes Over Time */}
              <div className="bg-gray-100 dark:bg-zinc-900 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-zinc-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
                  </svg>
                  {t('votingTrend')}
                </h3>
                <div className="space-y-2">
                  {Object.entries(analytics.votesPerDay)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .slice(-10)
                    .map(([date, votes]) => {
                      const maxVotes = Math.max(...Object.values(analytics.votesPerDay));
                      const percentage = (votes / maxVotes) * 100;
                      return (
                        <div key={date}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            <span className="text-orange-500 dark:text-orange-400 font-semibold">{votes} {t('votes')}</span>
                          </div>
                          <div className="h-2 bg-gray-300 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-600 to-red-600"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Vote Distribution */}
              <div className="bg-gray-100 dark:bg-zinc-900 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-zinc-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                  </svg>
                  {t('voterEngagement')}
                </h3>
                <div className="space-y-2">
                  {Object.entries(analytics.voteDistribution)
                    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                    .slice(0, 10)
                    .map(([voteCount, userCount]) => {
                      const maxUsers = Math.max(...Object.values(analytics.voteDistribution));
                      const percentage = (userCount / maxUsers) * 100;
                      return (
                        <div key={voteCount}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">{voteCount} {parseInt(voteCount) === 1 ? t('vote') : t('votes')}</span>
                            <span className="text-orange-500 dark:text-orange-400 font-semibold">{userCount} {userCount === 1 ? t('user') : t('users')}</span>
                          </div>
                          <div className="h-2 bg-gray-300 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-600 to-orange-600"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Top 10 Songs */}
            <div className="bg-gray-100 dark:bg-zinc-900 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-zinc-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {t('topMostVoted')}
              </h3>
              <div className="space-y-3">
                {analytics.topSongs.slice(0, 10).map((item, index) => {
                  const song = getSongById(item.songId);
                  if (!song) return null;
                  const percentage = (item.votes / analytics.overview.totalVotes) * 100;
                  return (
                    <div key={song.id} className="flex items-center gap-4 p-4 bg-white dark:bg-black/50 rounded-xl hover:bg-gray-200 dark:hover:bg-black/70 transition-all border border-gray-300 dark:border-transparent">
                      <div className={`text-2xl font-bold w-8 text-center ${
                        index < 3 ? 'text-orange-500' : 'text-gray-600 dark:text-gray-600'
                      }`}>
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index >= 3 && `#${index + 1}`}
                      </div>
                      {song.albumImage && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={song.albumImage}
                            alt={song.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">{song.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{song.albumName}</p>
                        <div className="mt-2">
                          <div className="h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                index < 3
                                  ? 'bg-gradient-to-r from-orange-600 to-red-600'
                                  : 'bg-gradient-to-r from-zinc-600 to-zinc-700'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          index < 3 ? 'text-orange-500' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {item.votes}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-500">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Songs Tab */}
        {activeTab === 'songs' && (
          <div className="space-y-6">
            {/* Search and Sort */}
            <div className="bg-gray-100 dark:bg-zinc-900 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-zinc-800">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none px-6 py-3 pr-10 bg-white dark:bg-black border border-gray-300 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none cursor-pointer"
                  >
                    <option value="votes">{tVoting('sortMostVoted')}</option>
                    <option value="name">{tVoting('sortAZ')}</option>
                    <option value="album">{tVoting('sortAlbum')}</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {t('showing')} <span className="text-orange-500 font-semibold">{songsWithVotes.length}</span> {t('of')} <span className="text-orange-500 font-semibold">{songs.length}</span> {t('songs')}
              </div>
            </div>

            {/* Songs List */}
            <div className="bg-gray-100 dark:bg-zinc-900 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-200 dark:bg-black/50 border-b border-gray-300 dark:border-zinc-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('rank')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('song')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('album')}</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('votes')}</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('ofTotal')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300 dark:divide-zinc-800">
                    {songsWithVotes.map((song, index) => {
                      const percentage = analytics.overview.totalVotes > 0
                        ? (song.votes / analytics.overview.totalVotes) * 100
                        : 0;
                      return (
                        <tr key={song.id} className="hover:bg-gray-200 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-lg font-bold ${
                              index < 3 ? 'text-orange-500' : 'text-gray-600 dark:text-gray-600'
                            }`}>
                              #{index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {song.albumImage && (
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={song.albumImage}
                                    alt={song.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="font-medium text-gray-900 dark:text-white">{song.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">{song.albumName}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className={`text-lg font-bold ${
                              song.votes > 0 ? 'text-orange-500' : 'text-gray-600 dark:text-gray-600'
                            }`}>
                              {song.votes}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-24 h-2 bg-gray-300 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-orange-600 to-red-600"
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Voters Tab */}
        {activeTab === 'voters' && (
          <div className="space-y-6">
            {/* Top Voters */}
            <div className="bg-gray-100 dark:bg-zinc-900 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-zinc-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {t('topMostActiveVoters')}
              </h3>
              <div className="space-y-3">
                {analytics.topVoters.map((voter, index) => (
                  <div key={voter.userId} className="flex items-center gap-4 p-4 bg-white dark:bg-black/50 rounded-xl">
                    <div className={`text-xl font-bold w-8 text-center ${
                      index < 3 ? 'text-orange-500' : 'text-gray-600 dark:text-gray-600'
                    }`}>
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index >= 3 && `#${index + 1}`}
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-gray-900 dark:text-white text-sm">{voter.userId}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        index < 3 ? 'text-orange-500' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {voter.votes}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-500">{t('votes')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voter Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-100 dark:bg-zinc-900 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-zinc-800 text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">
                  {analytics.overview.uniqueVoters}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{t('totalUniqueVoters')}</div>
              </div>
              <div className="bg-gray-100 dark:bg-zinc-900 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-zinc-800 text-center">
                <div className="text-4xl font-bold text-red-500 mb-2">
                  {(analytics.overview.totalVotes / analytics.overview.uniqueVoters).toFixed(1)}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{t('avgVotesPerVoter')}</div>
              </div>
              <div className="bg-gray-100 dark:bg-zinc-900 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-zinc-800 text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">
                  {analytics.topVoters[0]?.votes || 0}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{t('mostVotesByOneUser')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="bg-gray-100 dark:bg-zinc-900 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-zinc-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
                {t('recentActivity')}
              </h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {analytics.recentActivity.map((activity, index) => {
                  const song = getSongById(activity.songId);
                  if (!song) return null;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-black/50 rounded-xl hover:bg-gray-200 dark:hover:bg-black/70 transition-colors">
                      {song.albumImage && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={song.albumImage}
                            alt={song.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white text-sm truncate">{song.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-500 font-mono truncate">{activity.userId}</div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(activity.timestamp)}
                      </div>
                      <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
