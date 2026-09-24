import { useEffect } from 'react';

/**
 * Ensures clean page top alignment on new document load unless a hash anchor is targeted.
 */
export default function ScrollToTop() {
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
}
