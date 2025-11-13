'use client';

import { useTranslations } from 'next-intl';

export default function AboutEvent() {
  const t = useTranslations('about');
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      ),
      title: t('feature1Title'),
      description: t('feature1Desc'),
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      title: t('feature2Title'),
      description: t('feature2Desc'),
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
      title: t('feature3Title'),
      description: t('feature3Desc'),
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
        </svg>
      ),
      title: t('feature4Title'),
      description: t('feature4Desc'),
    },
  ];

  return (
    <div id="about" className="relative py-8 sm:py-12 md:py-16 lg:py-20 bg-black">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-xs sm:text-sm font-semibold mb-3 sm:mb-4 uppercase tracking-wider">
            {t('badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 px-2">
            {t('title')}{' '}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed px-2">
            {t('description')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 md:mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-zinc-800/50 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/10 rounded-xl sm:rounded-2xl transition-all duration-300"></div>

              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg sm:rounded-xl flex items-center justify-center text-orange-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 [&>svg]:w-full [&>svg]:h-full">
                    {feature.icon}
                  </div>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-orange-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Why Vote Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-900/30 via-zinc-900/50 to-red-900/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 border border-orange-500/30 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 13h-.68l-2 2h1.91L19 17H5l1.78-2h2.05l-2-2H6l-3 3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-4l-3-3zm-1-5.05l-4.95 4.95-3.54-3.54 4.95-4.95L17 7.95zm-4.24-5.66L6.39 8.66c-.39.39-.39 1.02 0 1.41l4.95 4.95c.39.39 1.02.39 1.41 0l6.36-6.36c.39-.39.39-1.02 0-1.41L14.16 2.3c-.38-.4-1.01-.4-1.4-.01z"/>
                  </svg>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
                  {t('boxTitle')}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
                  {t('boxDescription')}
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-300 text-xs sm:text-sm font-semibold">
                    {t('tag1')}
                  </span>
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/20 border border-red-500/50 rounded-full text-red-300 text-xs sm:text-sm font-semibold">
                    {t('tag2')}
                  </span>
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-300 text-xs sm:text-sm font-semibold">
                    {t('tag3')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
