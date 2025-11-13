'use client';

import { useTranslations } from 'next-intl';

type VotingStatsProps = {
  totalSongs: number;
  totalVotes: number;
  userVotes: number;
  topAlbumName?: string;
};

export default function VotingStats({ totalSongs, totalVotes, userVotes, topAlbumName }: VotingStatsProps) {
  const t = useTranslations('stats');
  const stats = [
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      ),
      label: t('totalSongs'),
      value: totalSongs.toLocaleString(),
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/20 dark:bg-orange-500/10',
      borderColor: 'border-orange-500/50 dark:border-orange-500/30',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
        </svg>
      ),
      label: t('totalVotes'),
      value: totalVotes.toLocaleString(),
      color: 'from-orange-600 to-red-600',
      bgColor: 'bg-orange-500/20 dark:bg-orange-500/10',
      borderColor: 'border-orange-500/50 dark:border-orange-500/30',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      ),
      label: t('yourVotes'),
      value: userVotes.toLocaleString(),
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      label: t('mostPopular'),
      value: topAlbumName || t('loading'),
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/20 dark:bg-orange-500/10',
      borderColor: 'border-orange-500/50 dark:border-orange-500/30',
      isText: true,
    },
  ];

  return (
    <div className="bg-black py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 sm:mb-2 px-2">
              {t('title')} <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">{t('titleHighlight')}</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 px-2">{t('subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`group relative bg-zinc-900 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border ${stat.borderColor} hover:border-opacity-70 transition-all duration-300 hover:transform hover:scale-105 overflow-hidden`}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                <div className="relative">
                  {/* Icon */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-orange-500">
                      {stat.icon}
                    </div>
                  </div>

                  {/* Value */}
                  <div className={`text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent ${stat.isText ? 'text-base sm:text-lg truncate' : ''}`}>
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-2xl`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
