'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function PrototypeBanner() {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed
    const dismissed = localStorage.getItem('prototype-banner-dismissed');
    if (!dismissed) {
      // Small delay before showing for smooth animation
      setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 500);
    }
  }, []);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('prototype-banner-dismissed', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleDismiss}
      />

      {/* Popup Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full border-4 border-orange-500 pointer-events-auto transform transition-all duration-300 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-t-xl relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative flex items-start gap-4">
              {/* Warning Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {t('prototypeBanner.title')}
                </h2>
              </div>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/20"
                aria-label={t('prototypeBanner.dismiss')}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              {t('prototypeBanner.description')}
            </p>

            {/* Dismiss button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDismiss}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:scale-105"
              >
                {t('prototypeBanner.dismiss')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
