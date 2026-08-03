/**
 * REÚ WhatsApp chat widget
 * - Auto-opens once per session after delay
 * - FAB stays available on every page
 * - No navigation when phone number is empty
 */
(function () {
  'use strict';

  var WARNED = false;

  function warnMissingPhone() {
    if (WARNED) return;
    WARNED = true;
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(
        '[REÚ WhatsApp] Phone number is empty. Add it in Theme Editor → Footer group → WhatsApp chat → “WhatsApp phone number” (digits only, no + or spaces).'
      );
    }
  }

  function openExternal(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function init(root) {
    if (!root || root.dataset.reuWaReady === 'true') return;
    root.dataset.reuWaReady = 'true';

    var panel = root.querySelector('[data-reu-wa-panel]');
    var fab = root.querySelector('[data-reu-wa-fab]');
    var closeBtn = root.querySelector('[data-reu-wa-close]');
    var startBtn = root.querySelector('[data-reu-wa-start]');
    if (!panel || !fab) return;

    var phone = (root.getAttribute('data-phone') || '').replace(/\D/g, '');
    var waUrl = root.getAttribute('data-wa-url') || '';
    var delay = parseInt(root.getAttribute('data-delay') || '5000', 10);
    var sessionKey = root.getAttribute('data-session-key') || 'reu-wa-popup-shown';
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var openTimer = null;

    if (!phone) warnMissingPhone();

    function isOpen() {
      return panel.classList.contains('is-open') && !panel.hidden;
    }

    function setOpen(open) {
      if (open) {
        panel.hidden = false;
        // Force reflow for transition when leaving [hidden]
        void panel.offsetWidth;
        panel.classList.add('is-open');
        fab.setAttribute('aria-expanded', 'true');
        if (!reduceMotion) {
          // slight delay already handled by CSS
        }
        if (closeBtn) closeBtn.focus();
      } else {
        panel.classList.remove('is-open');
        fab.setAttribute('aria-expanded', 'false');
        var hide = function () {
          if (!panel.classList.contains('is-open')) panel.hidden = true;
        };
        if (reduceMotion) {
          hide();
        } else {
          window.setTimeout(hide, 280);
        }
      }
    }

    function markShown() {
      try {
        window.sessionStorage.setItem(sessionKey, '1');
      } catch (e) {}
    }

    function hasShown() {
      try {
        return window.sessionStorage.getItem(sessionKey) === '1';
      } catch (e) {
        return false;
      }
    }

    function startChat(e) {
      if (e) e.preventDefault();
      if (!phone || !waUrl) {
        warnMissingPhone();
        if (!isOpen()) setOpen(true);
        return false;
      }
      openExternal(waUrl);
      return false;
    }

    function onFabClick(e) {
      e.preventDefault();
      if (!phone || !waUrl) {
        warnMissingPhone();
        setOpen(!isOpen());
        return;
      }
      // Configured: open WhatsApp directly
      openExternal(waUrl);
    }

    fab.addEventListener('click', onFabClick);
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        setOpen(false);
        fab.focus();
        markShown();
      });
    }
    if (startBtn) {
      startBtn.addEventListener('click', startChat);
    }

    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        setOpen(false);
        fab.focus();
        markShown();
      }
    });

    // Auto-open once per session
    if (!hasShown()) {
      openTimer = window.setTimeout(function () {
        setOpen(true);
        markShown();
      }, isNaN(delay) ? 5000 : Math.max(0, delay));
    }

    document.addEventListener('shopify:section:unload', function cleanup(ev) {
      if (ev.target && ev.target.contains(root)) {
        if (openTimer) window.clearTimeout(openTimer);
        document.removeEventListener('shopify:section:unload', cleanup);
      }
    });
  }

  function boot(ctx) {
    (ctx || document).querySelectorAll('[data-reu-whatsapp]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { boot(document); });
  } else {
    boot(document);
  }

  document.addEventListener('shopify:section:load', function (e) {
    boot(e.target);
  });
})();
