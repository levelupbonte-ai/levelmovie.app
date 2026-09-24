/**
 * LevelUpLoader - Reusable 10-Facet Star Loader, Slow Navigations & Async Data Wrapper
 * 
 * Features:
 * - 10-facet star SVG symbol matching exact geometric specification (C=50,54.4).
 * - Smooth ~1.2s looped pulse around the facets + subtle breathing scale (1 to 1.03).
 * - 700ms timer for slow page navigation: shows full-screen overlay if navigation takes >700ms.
 * - Offline detection: "You're offline. Check your connection."
 * - Back/forward cache (pageshow) handling: hides loading overlay on persisted page show.
 * - LevelUpLoader.wrap(promise, options):
 *   - delay: 300ms before showing
 *   - minVisible: 500ms once visible
 *   - slowAfter: 8000ms -> "This is taking longer than usual..." [Keep waiting] [Retry]
 *   - failAfter: 20000ms -> Cracked star error state [Try again]
 * - Accessible: role="status", aria-live="polite", sr-only loading label.
 * - prefers-reduced-motion: static star with gentle opacity fade.
 */

(function () {
  if (typeof window === 'undefined') return;

  const STAR_FACETS = [
    { id: 'f0', d: 'M 50,54.4 L 38.54,38.62 L 50,10 Z', fill: '#FFFFFF' },
    { id: 'f1', d: 'M 50,54.4 L 50,10 L 61.46,38.62 Z', fill: '#DDD3FF' },
    { id: 'f2', d: 'M 50,54.4 L 61.46,38.62 L 93.75,40.18 Z', fill: '#8B5CF6' },
    { id: 'f3', d: 'M 50,54.4 L 93.75,40.18 L 68.55,60.43 Z', fill: '#6D28D9' },
    { id: 'f4', d: 'M 50,54.4 L 68.55,60.43 L 77.04,91.61 Z', fill: '#8B5CF6' },
    { id: 'f5', d: 'M 50,54.4 L 77.04,91.61 L 50,73.9 Z', fill: '#6D28D9' },
    { id: 'f6', d: 'M 50,54.4 L 50,73.9 L 22.96,91.61 Z', fill: '#8B5CF6' },
    { id: 'f7', d: 'M 50,54.4 L 22.96,91.61 L 31.45,60.43 Z', fill: '#6D28D9' },
    { id: 'f8', d: 'M 50,54.4 L 31.45,60.43 L 6.25,40.18 Z', fill: '#8B5CF6' },
    { id: 'f9', d: 'M 50,54.4 L 6.25,40.18 L 38.54,38.62 Z', fill: '#6D28D9' },
  ];

  // Injected CSS Styles for LevelUpLoader
  const LOADER_STYLES = `
    /* Star Breathing Scale */
    @keyframes starBreathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }

    /* Facet sequential glow cycle (1.2s) */
    @keyframes facetCycle {
      0%, 100% { opacity: 0.35; }
      15% { opacity: 1; filter: drop-shadow(0 0 4px rgba(221, 211, 255, 0.8)); }
      30% { opacity: 0.35; filter: none; }
    }

    .star-loop-container {
      display: inline-block;
      animation: starBreathe 2.4s ease-in-out infinite;
      transform-origin: 50px 54.4px;
      overflow: visible;
    }

    .star-loop-facet {
      animation: facetCycle 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    .slf-0 { animation-delay: 0.00s; }
    .slf-1 { animation-delay: 0.12s; }
    .slf-2 { animation-delay: 0.24s; }
    .slf-3 { animation-delay: 0.36s; }
    .slf-4 { animation-delay: 0.48s; }
    .slf-5 { animation-delay: 0.60s; }
    .slf-6 { animation-delay: 0.72s; }
    .slf-7 { animation-delay: 0.84s; }
    .slf-8 { animation-delay: 0.96s; }
    .slf-9 { animation-delay: 1.08s; }

    /* Offline Toast */
    #levelup-offline-toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #14141F;
      border: 1px solid #7C3AED;
      color: #FFFFFF;
      padding: 12px 24px;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
      z-index: 1000000;
      opacity: 0;
      transition: transform 0.25s ease, opacity 0.25s ease;
      pointer-events: none;
    }
    #levelup-offline-toast.toast-show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    /* Slow Navigation Fullscreen Overlay */
    #levelup-nav-overlay {
      position: fixed;
      inset: 0;
      z-index: 999998;
      background-color: #0B0B14;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease-in-out;
    }
    #levelup-nav-overlay.overlay-active {
      opacity: 1;
      pointer-events: all;
    }

    /* Cracked Star (Data Error State) */
    .cracked-star-crack {
      stroke: #DDD3FF;
      stroke-width: 1.5;
      stroke-linecap: round;
      opacity: 0.85;
      animation: crackFlicker 3s ease-in-out infinite alternate;
    }
    @keyframes crackFlicker {
      0%, 100% { opacity: 0.65; }
      50% { opacity: 0.95; filter: drop-shadow(0 0 3px #DDD3FF); }
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .star-loop-container,
      .star-loop-facet,
      .cracked-star-crack {
        animation: none !important;
      }
      .star-loop-facet {
        opacity: 0.85 !important;
      }
    }
  `;

  // Inject Styles into Document Head
  function injectStyles() {
    if (document.getElementById('levelup-loader-styles')) return;
    const style = document.createElement('style');
    style.id = 'levelup-loader-styles';
    style.textContent = LOADER_STYLES;
    document.head.appendChild(style);
  }

  // Inject SVG Symbol Definition
  function injectSymbol() {
    if (document.getElementById('levelup-star-symbol-svg')) return;
    const svgDiv = document.createElement('div');
    svgDiv.id = 'levelup-star-symbol-svg';
    svgDiv.setAttribute('aria-hidden', 'true');
    svgDiv.style.position = 'absolute';
    svgDiv.style.width = '0';
    svgDiv.style.height = '0';
    svgDiv.style.overflow = 'hidden';

    svgDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <symbol id="levelup-star-symbol" viewBox="0 0 100 100">
          ${STAR_FACETS.map(
            (f, i) =>
              `<path id="${f.id}" class="star-loop-facet slf-${i}" d="${f.d}" fill="${f.fill}" />`
          ).join('')}
        </symbol>
      </svg>
    `;
    document.body ? document.body.appendChild(svgDiv) : document.addEventListener('DOMContentLoaded', () => document.body.appendChild(svgDiv));
  }

  // Create SVG Star Element
  function createStarSvg(width = 54, height = 54, className = '') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('class', `star-loop-container ${className}`.trim());
    svg.setAttribute('role', 'status');
    svg.setAttribute('aria-live', 'polite');

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'Loading...';
    svg.appendChild(title);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    STAR_FACETS.forEach((f, i) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', f.d);
      path.setAttribute('fill', f.fill);
      path.setAttribute('class', `star-loop-facet slf-${i}`);
      g.appendChild(path);
    });
    svg.appendChild(g);

    return svg;
  }

  // Create Cracked Star SVG for Data Error State
  function createCrackedStarSvg(width = 64, height = 64) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('class', 'overflow-visible select-none');
    svg.setAttribute('aria-hidden', 'true');

    // Dimmed facets
    const dimmedColors = [
      '#B0A8C0', '#9080A8', '#6A4A9C', '#4F2D78',
      '#6A4A9C', '#4F2D78', '#6A4A9C', '#4F2D78',
      '#6A4A9C', '#4F2D78'
    ];

    let html = '';
    STAR_FACETS.forEach((f, i) => {
      html += `<path d="${f.d}" fill="${dimmedColors[i]}" opacity="0.88" />`;
    });

    // Thin light cracks (1.5px, #DDD3FF) from center C (50, 54.4) to outer tips
    html += `
      <line x1="50" y1="54.4" x2="50" y2="10" class="cracked-star-crack" />
      <line x1="50" y1="54.4" x2="93.75" y2="40.18" class="cracked-star-crack" />
      <line x1="50" y1="54.4" x2="77.04" y2="91.61" class="cracked-star-crack" />
      <line x1="50" y1="54.4" x2="22.96" y2="91.61" class="cracked-star-crack" />
      <line x1="50" y1="54.4" x2="6.25" y2="40.18" class="cracked-star-crack" />
      <line x1="50" y1="54.4" x2="61.46" y2="38.62" class="cracked-star-crack" stroke-dasharray="2,2" />
      <line x1="50" y1="54.4" x2="38.54" y2="38.62" class="cracked-star-crack" stroke-dasharray="2,2" />
    `;

    svg.innerHTML = html;
    return svg;
  }

  // Toast Notification for Offline state
  function showOfflineToast() {
    let toast = document.getElementById('levelup-offline-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'levelup-offline-toast';
      toast.setAttribute('role', 'alert');
      toast.textContent = "You're offline. Check your connection.";
      document.body.appendChild(toast);
    }
    toast.classList.add('toast-show');
    setTimeout(() => {
      toast.classList.remove('toast-show');
    }, 3800);
  }

  // Full-screen Slow Navigation Overlay Setup
  let navOverlayTimer = null;

  function ensureNavOverlay() {
    let overlay = document.getElementById('levelup-nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'levelup-nav-overlay';
      overlay.setAttribute('role', 'status');
      overlay.setAttribute('aria-live', 'polite');
      
      const star = createStarSvg(68, 68);
      overlay.appendChild(star);

      const label = document.createElement('div');
      label.style.fontSize = '12px';
      label.style.fontWeight = '500';
      label.style.letterSpacing = '0.05em';
      label.style.color = '#A1A1B5';
      label.textContent = 'Loading page...';
      overlay.appendChild(label);

      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function hideNavigationOverlay() {
    if (navOverlayTimer) {
      clearTimeout(navOverlayTimer);
      navOverlayTimer = null;
    }
    const overlay = document.getElementById('levelup-nav-overlay');
    if (overlay) {
      overlay.classList.remove('overlay-active');
    }
  }

  // Setup Global Link Click Listener for 700ms Slow Navigation Timer
  function initNavigationListener() {
    document.addEventListener('click', (e) => {
      const link = (e.target).closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      const target = link.getAttribute('target');

      // Ignore external, hash anchors, mailto, tel, downloads, or new tabs
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        target === '_blank' ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0
      ) {
        return;
      }

      // Check if external domain
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
      } catch {
        return;
      }

      // Check online status
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        showOfflineToast();
        return;
      }

      // Start 700ms slow navigation timer
      if (navOverlayTimer) clearTimeout(navOverlayTimer);
      navOverlayTimer = setTimeout(() => {
        const overlay = ensureNavOverlay();
        overlay.classList.add('overlay-active');
      }, 700);
    });

    // Handle Back / Forward Cache (pageshow event with persisted === true)
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        hideNavigationOverlay();
        const bar = document.getElementById('page-progress-bar');
        if (bar) {
          bar.classList.remove('active', 'loading', 'finish');
          bar.style.width = '0%';
        }
      }
    });

    window.addEventListener('pagehide', () => {
      hideNavigationOverlay();
    });
  }

  /**
   * LevelUpLoader.wrap:
   * Wraps an async Promise for data loads (previews, forms, Firestore, etc.)
   * Options:
   * - container: HTMLElement | string (selector)
   * - delay: 300ms (only show if exceeds delay)
   * - minVisible: 500ms (prevent flicker)
   * - slowAfter: 8000ms ("This is taking longer than usual...")
   * - failAfter: 20000ms (Error state with broken star)
   * - onRetry: callback function
   */
  function wrap(promiseFactoryOrPromise, options = {}) {
    const {
      container,
      delay = 300,
      minVisible = 500,
      slowAfter = 8000,
      failAfter = 20000,
      onRetry,
    } = options;

    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) {
      return typeof promiseFactoryOrPromise === 'function' ? promiseFactoryOrPromise() : promiseFactoryOrPromise;
    }

    const previousBusy = el.getAttribute('aria-busy');
    el.setAttribute('aria-busy', 'true');

    // Create inline loader wrapper
    const loaderBox = document.createElement('div');
    loaderBox.className = 'levelup-inline-loader flex flex-col items-center justify-center p-8 space-y-4 text-center my-4';
    loaderBox.setAttribute('role', 'status');
    loaderBox.setAttribute('aria-live', 'polite');

    const starSvg = createStarSvg(50, 50);
    loaderBox.appendChild(starSvg);

    const statusText = document.createElement('p');
    statusText.className = 'text-xs text-[#A1A1B5] font-medium';
    statusText.textContent = 'Generating draft...';
    loaderBox.appendChild(statusText);

    let isVisible = false;
    let shownAt = 0;
    let delayTimer = null;
    let slowTimer = null;
    let timeoutTimer = null;
    let isCompleted = false;

    // Show after delay (300ms)
    delayTimer = setTimeout(() => {
      if (!isCompleted) {
        isVisible = true;
        shownAt = Date.now();
        el.appendChild(loaderBox);
      }
    }, delay);

    // Slow state at 8s
    slowTimer = setTimeout(() => {
      if (!isCompleted && isVisible) {
        statusText.textContent = 'This is taking longer than usual...';
        
        let actionRow = loaderBox.querySelector('.loader-action-row');
        if (!actionRow) {
          actionRow = document.createElement('div');
          actionRow.className = 'loader-action-row flex items-center justify-center gap-3 pt-2';

          const keepWaitingBtn = document.createElement('button');
          keepWaitingBtn.type = 'button';
          keepWaitingBtn.className = 'px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-white transition-colors cursor-pointer';
          keepWaitingBtn.textContent = 'Keep waiting';
          keepWaitingBtn.onclick = () => {
            statusText.textContent = 'Still working on your preview...';
            actionRow.remove();
          };

          if (onRetry) {
            const retryBtn = document.createElement('button');
            retryBtn.type = 'button';
            retryBtn.className = 'px-3.5 py-1.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-xs font-semibold text-white transition-colors cursor-pointer';
            retryBtn.textContent = 'Retry';
            retryBtn.onclick = () => {
              cleanup();
              wrap(promiseFactoryOrPromise, options);
            };
            actionRow.appendChild(retryBtn);
          }

          actionRow.appendChild(keepWaitingBtn);
          loaderBox.appendChild(actionRow);
        }
      }
    }, slowAfter);

    function renderTimeoutError(rejectFn) {
      if (isCompleted) return;
      isCompleted = true;
      clearTimeout(delayTimer);
      clearTimeout(slowTimer);
      clearTimeout(timeoutTimer);

      loaderBox.innerHTML = '';
      const crackedStar = createCrackedStarSvg(56, 56);
      loaderBox.appendChild(crackedStar);

      const errTitle = document.createElement('div');
      errTitle.className = 'text-sm font-bold text-white';
      errTitle.textContent = 'Something went wrong on our side.';
      loaderBox.appendChild(errTitle);

      const errDesc = document.createElement('p');
      errDesc.className = 'text-xs text-[#A1A1B5] max-w-xs';
      errDesc.textContent = 'Your input is safe. Please click try again.';
      loaderBox.appendChild(errDesc);

      const retryBtn = document.createElement('button');
      retryBtn.type = 'button';
      retryBtn.className = 'px-5 py-2 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-xs font-semibold text-white transition-colors shadow-md shadow-[#7C3AED]/20 cursor-pointer mt-1';
      retryBtn.textContent = 'Try again';
      retryBtn.onclick = () => {
        cleanup();
        wrap(promiseFactoryOrPromise, options);
      };
      loaderBox.appendChild(retryBtn);

      if (rejectFn) rejectFn(new Error('Operation timed out after 20 seconds.'));
    }

    // Fail after 20s timeout
    timeoutTimer = setTimeout(() => {
      renderTimeoutError();
    }, failAfter);

    function cleanup() {
      clearTimeout(delayTimer);
      clearTimeout(slowTimer);
      clearTimeout(timeoutTimer);
      if (previousBusy) {
        el.setAttribute('aria-busy', previousBusy);
      } else {
        el.removeAttribute('aria-busy');
      }
      if (loaderBox.parentNode) {
        loaderBox.parentNode.removeChild(loaderBox);
      }
    }

    const promise = typeof promiseFactoryOrPromise === 'function' ? promiseFactoryOrPromise() : promiseFactoryOrPromise;

    return new Promise((resolve, reject) => {
      promise
        .then((result) => {
          isCompleted = true;
          clearTimeout(slowTimer);
          clearTimeout(timeoutTimer);

          if (!isVisible) {
            clearTimeout(delayTimer);
            cleanup();
            resolve(result);
          } else {
            // Keep visible for at least minVisible (500ms) to prevent flicker
            const elapsed = Date.now() - shownAt;
            const remaining = Math.max(0, minVisible - elapsed);
            setTimeout(() => {
              cleanup();
              resolve(result);
            }, remaining);
          }
        })
        .catch((err) => {
          isCompleted = true;
          clearTimeout(slowTimer);
          clearTimeout(timeoutTimer);
          cleanup();
          reject(err);
        });
    });
  }

  // Initialize on load
  injectStyles();
  injectSymbol();
  initNavigationListener();

  // Public LevelUpLoader API
  window.LevelUpLoader = {
    wrap,
    createStarSvg,
    createCrackedStarSvg,
    hideNavigationOverlay,
    showOfflineToast,
  };
})();
