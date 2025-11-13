'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function EventHero() {
  const t = useTranslations('hero');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const eventDate = new Date('2026-05-02T20:00:00+02:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-white dark:bg-black border-b border-orange-500/20">
      {/* Animated Background Elements - Glowing Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glowing orange particles */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Floating ember particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-orange-500 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-float opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-60 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-float opacity-70" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-orange-500 rounded-full animate-float opacity-60" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-60 right-20 w-3 h-3 bg-red-500 rounded-full animate-float opacity-50" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-orange-400 rounded-full animate-float opacity-70" style={{ animationDelay: '2.5s' }}></div>
      </div>

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-orange-500/30 dark:bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-600 dark:text-orange-300 text-sm font-semibold animate-pulse uppercase tracking-wider">
                {t('badge')}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white tracking-wider">
                {t('title')}
              </span>
            </h1>

            {/* Eagle Title */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-900 dark:text-white animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 9l3 2 7-5 7 5 3-2L12 2z" />
                <path d="M12 6l-7 5v6l7 4 7-4v-6l-7-5z" opacity="0.6" />
              </svg>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {t('subtitle')}
              </h2>
            </div>

            {/* Event Details */}
            <div className="mb-8 space-y-3">
              <div className="flex items-center justify-center lg:justify-start gap-3 text-xl md:text-2xl text-gray-800 dark:text-white/90">
                <svg className="w-7 h-7 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span className="font-semibold">{t('venue')}</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-lg md:text-xl text-orange-600 dark:text-orange-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                </svg>
                <span className="font-semibold">{t('date')}</span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-widest text-orange-600 dark:text-orange-300 mb-4 font-semibold">
                {t('countdown')}
              </h3>
              <div className="grid grid-cols-4 gap-3 max-w-xl">
                {[
                  { value: timeLeft.days, label: t('days') },
                  { value: timeLeft.hours, label: t('hours') },
                  { value: timeLeft.minutes, label: t('minutes') },
                  { value: timeLeft.seconds, label: t('seconds') },
                ].map((item) => (
                  <div key={item.label} className="relative group">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900/80 dark:to-black/80 backdrop-blur-xl rounded-xl p-4 border border-orange-500/50 dark:border-orange-500/30 shadow-xl shadow-orange-500/10 group-hover:border-orange-500/60 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-orange-400 to-red-500 bg-clip-text text-transparent">
                          {String(item.value).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-orange-600 dark:text-orange-300 mt-1 font-medium uppercase tracking-wider">
                          {item.label}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
              <button
                onClick={() => {
                  document.getElementById('voting-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-bold text-xl shadow-2xl shadow-orange-500/60 hover:shadow-orange-500/80 transition-all duration-300 transform hover:scale-110 flex items-center gap-3 animate-pulse hover:animate-none ring-4 ring-orange-500/30 hover:ring-orange-500/50"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity -z-10"></div>

                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                </svg>
                {t('voteNow')}
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

              <a
                href="#about"
                className="px-8 py-4 bg-gray-200 dark:bg-zinc-900/50 hover:bg-gray-300 dark:hover:bg-zinc-900/70 border border-orange-500/30 hover:border-orange-500/60 text-gray-900 dark:text-white rounded-xl font-semibold text-lg backdrop-blur-xl transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('exploreSetlist')}
              </a>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative block w-full">
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border-4 border-orange-500/40 dark:border-orange-500/30 shadow-2xl shadow-orange-500/20 bg-white dark:bg-black p-4">
              {/* Hero Image */}
              <Image
                src="/images/fally-ipupa.png"
                alt="Fally Ipupa - The Eagle"
                fill
                className="object-contain"
                priority
              />

              {/* Gradient Overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

              {/* Glow Effects */}
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
