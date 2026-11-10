import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/gtm';
import { sendMetaPageView } from '../lib/metaCapi';

export function GTMPageViewTracker() {
  const location = useLocation();
  const previousPathRef = useRef<string>('');

  useEffect(() => {
    const currentPath = location.pathname + location.search;

    if (previousPathRef.current !== currentPath) {
      previousPathRef.current = currentPath;
      trackPageView(location.pathname, location.search);
      sendMetaPageView();
    }
  }, [location.pathname, location.search]);

  return null;
}
