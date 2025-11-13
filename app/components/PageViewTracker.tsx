'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Generate or get visitor ID from localStorage
    let visitorId = localStorage.getItem('visitor-id');
    if (!visitorId) {
      visitorId = `visitor-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('visitor-id', visitorId);
    }

    // Generate session ID (expires after 30 minutes of inactivity)
    let sessionId = sessionStorage.getItem('session-id');
    const lastActivity = sessionStorage.getItem('last-activity');
    const now = Date.now();

    // Check if session has expired (30 minutes = 1800000ms)
    if (!sessionId || !lastActivity || (now - parseInt(lastActivity)) > 1800000) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem('session-id', sessionId);
    }
    sessionStorage.setItem('last-activity', now.toString());

    // Log the page view
    const logPageView = async () => {
      try {
        await fetch('/api/page-views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pagePath: pathname,
            visitorId,
            sessionId,
          }),
        });
      } catch (error) {
        // Silently fail - we don't want to break the user experience
        console.error('Failed to log page view:', error);
      }
    };

    logPageView();
  }, [pathname]);

  return null; // This component doesn't render anything
}
