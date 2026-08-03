/**
 * REÚ Trusted wellness reviews — marquee columns
 * Pause on hover/focus, offscreen, hidden tab; reduced-motion static grid.
 */
(function () {
  'use strict';

  function init(root) {
    if (!root || root.dataset.reuMrReady === 'true') return;
    root.dataset.reuMrReady = 'true';

    var pauseHover = root.getAttribute('data-pause-hover') !== 'false';
    var reducedFallback = root.getAttribute('data-reduced-fallback') !== 'false';
    var cols = root.querySelectorAll('[data-reu-mr-col]');
    var staticGrid = root.querySelector('[data-reu-mr-static]');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function setStatic(on) {
      if (!reducedFallback) return;
      root.classList.toggle('is-static', on);
      if (staticGrid) {
        if (on) {
          staticGrid.hidden = false;
          staticGrid.removeAttribute('hidden');
        } else {
          staticGrid.hidden = true;
          staticGrid.setAttribute('hidden', '');
        }
      }
    }

    function applyReducedMotion() {
      setStatic(reduceMotion.matches);
    }

    function syncVisibility() {
      var hidden = document.visibilityState === 'hidden';
      root.classList.toggle('is-paused', hidden || root.classList.contains('is-user-paused'));
    }

    function pauseUser(on) {
      root.classList.toggle('is-user-paused', on);
      root.classList.toggle('is-paused', on || document.visibilityState === 'hidden');
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            root.classList.toggle('is-inview', entry.isIntersecting);
          });
        },
        { root: null, threshold: 0.12 }
      );
      io.observe(root);
    } else {
      root.classList.add('is-inview');
    }

    cols.forEach(function (col) {
      if (pauseHover) {
        col.addEventListener('mouseenter', function () {
          col.classList.add('is-paused');
        });
        col.addEventListener('mouseleave', function () {
          if (!col.contains(document.activeElement)) col.classList.remove('is-paused');
        });
      }
      col.addEventListener('focusin', function () {
        col.classList.add('is-paused');
        pauseUser(true);
      });
      col.addEventListener('focusout', function (e) {
        if (!col.contains(e.relatedTarget)) {
          col.classList.remove('is-paused');
          pauseUser(false);
        }
      });
    });

    document.addEventListener('visibilitychange', syncVisibility);
    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener('change', applyReducedMotion);
    } else if (reduceMotion.addListener) {
      reduceMotion.addListener(applyReducedMotion);
    }

    applyReducedMotion();
    syncVisibility();
  }

  function boot(ctx) {
    (ctx || document).querySelectorAll('[data-reu-moving-reviews]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      boot(document);
    });
  } else {
    boot(document);
  }

  document.addEventListener('shopify:section:load', function (e) {
    boot(e.target);
  });
})();
