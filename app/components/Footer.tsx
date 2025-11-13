'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-orange-500/20 bg-white dark:bg-black mt-12 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {/* Eagle Icon */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg opacity-20 blur-xl"></div>
                <svg
                  className="w-8 h-8 text-white relative z-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 9l3 2 7-5 7 5 3-2L12 2z" />
                  <path d="M12 6l-7 5v6l7 4 7-4v-6l-7-5z" opacity="0.6" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  FALLY IPUPA
                </h3>
                <p className="text-sm text-orange-500 font-medium tracking-wider">{t('subtitle')}</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 max-w-md">
              {t('description')}
            </p>
            <div className="flex gap-3">
              {/* Social Media Placeholders */}
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-900/50 hover:bg-orange-600/30 border border-gray-300 dark:border-zinc-800/50 hover:border-orange-500/50 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-300 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                  <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-900/50 hover:bg-orange-600/30 border border-gray-300 dark:border-zinc-800/50 hover:border-orange-500/50 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-300 transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-900/50 hover:bg-orange-600/30 border border-gray-300 dark:border-zinc-800/50 hover:border-orange-500/50 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-300 transition-all duration-300"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-900/50 hover:bg-orange-600/30 border border-gray-300 dark:border-zinc-800/50 hover:border-orange-500/50 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-300 transition-all duration-300"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-orange-300 transition-colors duration-200 text-sm">
                  {t('home')}
                </Link>
              </li>
              <li>
                <a href="#about" className="text-gray-600 dark:text-gray-400 hover:text-orange-300 transition-colors duration-200 text-sm">
                  {t('about')}
                </a>
              </li>
              <li>
                <a href="#voting-section" className="text-gray-600 dark:text-gray-400 hover:text-orange-300 transition-colors duration-200 text-sm">
                  {t('vote')}
                </a>
              </li>
              <li>
                <Link href="/leaderboard" className="text-gray-600 dark:text-gray-400 hover:text-orange-300 transition-colors duration-200 text-sm">
                  {t('leaderboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Info */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('eventDetails')}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                </svg>
                <span>{t('date')} • {t('time')}</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>{t('venue')}</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <span>{t('capacity')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 dark:border-zinc-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            {t('copyright')}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {t('backToTop')}
            </button>
            <span className="text-gray-400 dark:text-zinc-700">•</span>
            <span className="text-gray-500 text-xs">
              {t('poweredBy')}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Eagle Silhouette */}
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-orange-500">
          <path d="M50 10 L30 30 L20 25 L25 35 L15 40 L25 45 L20 55 L30 50 L35 60 L40 50 L50 60 L60 50 L65 60 L70 50 L80 55 L75 45 L85 40 L75 35 L80 25 L70 30 L50 10 Z" />
        </svg>
      </div>
    </footer>
  );
}
