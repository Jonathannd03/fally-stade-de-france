'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { locales, localeNames, type Locale } from '@/i18n/request';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (newLocale: string) => {
    // Remove the current locale from the pathname
    const segments = pathname.split('/');
    const currentLocaleIndex = segments.findIndex((seg) => locales.includes(seg as Locale));

    let newPathname = pathname;
    if (currentLocaleIndex !== -1) {
      // Replace existing locale
      segments[currentLocaleIndex] = newLocale;
      newPathname = segments.join('/');
    } else {
      // Add locale prefix
      newPathname = `/${newLocale}${pathname}`;
    }

    router.push(newPathname);
    setIsOpen(false);
  };

  const flagEmojis: Record<Locale, string> = {
    en: '🇬🇧',
    fr: '🇫🇷',
    pt: '🇵🇹',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/50 text-gray-300 hover:text-white rounded-xl transition-all duration-300"
      >
        <span className="text-xl">{flagEmojis[locale as Locale]}</span>
        <span className="hidden sm:inline font-medium">{localeNames[locale as Locale]}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-fade-in">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                locale === loc
                  ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 text-orange-400 font-semibold'
                  : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{flagEmojis[loc]}</span>
              <span>{localeNames[loc]}</span>
              {locale === loc && (
                <svg className="w-4 h-4 ml-auto text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
