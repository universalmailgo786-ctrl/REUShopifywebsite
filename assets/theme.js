/* REÚ theme — vanilla JS modules. No jQuery, no heavy libraries. */
(function () {
  'use strict';
  var REU = (window.REU = window.REU || {});
  var routes = REU.routes || {};
  var strings = REU.strings || {};

  /* -------------------- helpers -------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function money(cents) {
    try { return (window.Shopify && Shopify.formatMoney) ? Shopify.formatMoney(cents) : '$' + (cents / 100).toFixed(2); }
    catch (e) { return '$' + (cents / 100).toFixed(2); }
  }
  var focusableSel = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function trapFocus(container, opener) {
    var nodes = $all(focusableSel, container).filter(function (n) { return n.offsetParent !== null; });
    if (!nodes.length) return function () {};
    var first = nodes[0], last = nodes[nodes.length - 1];
    function onKey(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    container.addEventListener('keydown', onKey);
    first.focus();
    return function () { container.removeEventListener('keydown', onKey); if (opener) opener.focus(); };
  }

  var scrollLock = {
    _y: 0,
    on: function () {
      this._y = window.scrollY;
      document.body.style.top = -this._y + 'px';
      document.body.classList.add('scroll-locked');
    },
    off: function () {
      document.body.classList.remove('scroll-locked');
      document.body.style.top = '';
      window.scrollTo(0, this._y);
    }
  };

  /* -------------------- generic drawer / dialog -------------------- */
  // <details>-free accessible drawer controlled by [data-drawer-open="ID"] and #ID[data-drawer]
  function openDrawer(id, opener) {
    var drawer = document.getElementById(id);
    if (!drawer) return;
    drawer.hidden = false;
    requestAnimationFrame(function () { drawer.classList.add('is-open'); });
    drawer.setAttribute('aria-hidden', 'false');
    scrollLock.on();
    drawer._release = trapFocus(drawer, opener || null);
    drawer._onEsc = function (e) { if (e.key === 'Escape') closeDrawer(id); };
    document.addEventListener('keydown', drawer._onEsc);
  }
  function closeDrawer(id) {
    var drawer = document.getElementById(id);
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    scrollLock.off();
    if (drawer._release) drawer._release();
    if (drawer._onEsc) document.removeEventListener('keydown', drawer._onEsc);
    var onEnd = function () { drawer.hidden = true; drawer.removeEventListener('transitionend', onEnd); };
    drawer.addEventListener('transitionend', onEnd);
    setTimeout(onEnd, 400);
  }
  REU.openDrawer = openDrawer;
  REU.closeDrawer = closeDrawer;

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-drawer-open]');
    if (opener) { e.preventDefault(); openDrawer(opener.getAttribute('data-drawer-open'), opener); return; }
    var closer = e.target.closest('[data-drawer-close]');
    if (closer) { e.preventDefault(); closeDrawer(closer.getAttribute('data-drawer-close') || closer.closest('[data-drawer]').id); return; }
    var overlay = e.target.closest('[data-drawer-overlay]');
    if (overlay) { closeDrawer(overlay.closest('[data-drawer]').id); }
  });

  /* -------------------- accordions -------------------- */
  function initAccordions(ctx) {
    $all('[data-accordion] .accordion__trigger', ctx).forEach(function (btn) {
      if (btn._bound) return; btn._bound = true;
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        if (panel) {
          if (open) { panel.style.height = panel.scrollHeight + 'px'; requestAnimationFrame(function () { panel.style.height = '0px'; }); }
          else { panel.hidden = false; panel.style.height = panel.scrollHeight + 'px'; panel.addEventListener('transitionend', function te() { panel.style.height = 'auto'; panel.removeEventListener('transitionend', te); }); }
        }
        if (open && panel) { panel.addEventListener('transitionend', function te2() { panel.hidden = true; panel.removeEventListener('transitionend', te2); }); }
      });
    });
  }

  /* -------------------- cart -------------------- */
  function refreshCartUI(cart) {
    $all('[data-cart-count]').forEach(function (el) {
      el.textContent = cart.item_count;
      el.hidden = cart.item_count === 0;
    });
    // Ask cart drawer to re-render from Section Rendering API result if present
  }

  function fetchCart() {
    return fetch(routes.cart_url + '.js', { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.json(); });
  }

  function addToCart(form, opts) {
    opts = opts || {};
    var btn = form.querySelector('[type="submit"]');
    var original = btn ? btn.innerHTML : '';
    if (btn) { btn.setAttribute('aria-busy', 'true'); btn.disabled = true; }
    var data = new FormData(form);
    data.append('sections', 'cart-drawer');
    return fetch(routes.cart_add_url, { method: 'POST', headers: { 'Accept': 'application/json' }, body: data })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (!res.ok) { throw new Error(res.body && res.body.description ? res.body.description : strings.cartError); }
        return fetchCart().then(function (cart) {
          refreshCartUI(cart);
          if (res.body.sections && res.body.sections['cart-drawer']) {
            var host = $('[data-cart-drawer-content]');
            if (host) {
              var tmp = document.createElement('div');
              tmp.innerHTML = res.body.sections['cart-drawer'];
              var next = tmp.querySelector('[data-cart-drawer-content]');
              if (next) host.innerHTML = next.innerHTML;
            }
          }
          openDrawer('CartDrawer', btn);
          return cart;
        });
      })
      .catch(function (err) {
        announce(err.message || strings.cartError, 'error');
      })
      .finally(function () { if (btn) { btn.removeAttribute('aria-busy'); btn.disabled = false; btn.innerHTML = original; } });
  }

  function changeLine(line, quantity) {
    return fetch(routes.cart_change_url, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ line: line, quantity: quantity, sections: 'cart-drawer' })
    }).then(function (r) { return r.json(); }).then(function (cart) {
      refreshCartUI(cart);
      if (cart.sections && cart.sections['cart-drawer']) {
        var host = $('[data-cart-drawer-content]');
        if (host) {
          var tmp = document.createElement('div'); tmp.innerHTML = cart.sections['cart-drawer'];
          var next = tmp.querySelector('[data-cart-drawer-content]');
          if (next) host.innerHTML = next.innerHTML;
        }
      }
      // update cart page if present
      var cartForm = $('[data-cart-page]');
      if (cartForm) window.location.reload();
      return cart;
    });
  }

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[data-product-form]');
    if (!form) return;
    e.preventDefault();
    addToCart(form);
  });

  document.addEventListener('click', function (e) {
    var q = e.target.closest('[data-line-change]');
    if (!q) return;
    e.preventDefault();
    var line = q.getAttribute('data-line');
    var qty = parseInt(q.getAttribute('data-qty'), 10);
    changeLine(parseInt(line, 10), qty);
  });

  /* -------------------- quantity steppers -------------------- */
  document.addEventListener('click', function (e) {
    var step = e.target.closest('[data-qty-step]');
    if (!step) return;
    var wrap = step.closest('[data-qty]');
    var input = wrap.querySelector('input[type="number"]');
    var dir = parseInt(step.getAttribute('data-qty-step'), 10);
    var val = Math.max(parseInt(input.min || '1', 10), (parseInt(input.value, 10) || 1) + dir);
    input.value = val;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* -------------------- live region announcements -------------------- */
  function announce(msg, type) {
    var region = $('#reu-live');
    if (!region) { region = document.createElement('div'); region.id = 'reu-live'; region.setAttribute('aria-live', 'polite'); region.className = 'visually-hidden'; document.body.appendChild(region); }
    region.textContent = msg;
    if (type === 'error') {
      var toast = document.createElement('div');
      toast.className = 'reu-toast reu-toast--error';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(function () { toast.classList.add('show'); }, 10);
      setTimeout(function () { toast.classList.remove('show'); setTimeout(function () { toast.remove(); }, 300); }, 4000);
    }
  }
  REU.announce = announce;

  /* -------------------- variant / format selector + sticky bar sync -------------------- */
  function initProduct(ctx) {
    var root = $('[data-product-root]', ctx) || $('[data-product-root]');
    if (!root || root._bound) return;
    root._bound = true;
    var dataEl = $('[data-product-json]', root);
    if (!dataEl) return;
    var product = JSON.parse(dataEl.textContent);
    var form = $('form[data-product-form]', root);
    var idInput = form ? form.querySelector('[name="id"]') : null;

    function currentOptions() {
      return $all('[data-option-index]', root).map(function (group) {
        var checked = group.querySelector('input:checked, select');
        if (checked && checked.tagName === 'SELECT') return checked.value;
        return checked ? checked.value : null;
      });
    }
    function findVariant(opts) {
      return product.variants.find(function (v) {
        return opts.every(function (o, i) { return o == null || v.options[i] === o; });
      });
    }
    function update() {
      var v = findVariant(currentOptions()) || product.variants[0];
      if (!v) return;
      if (idInput) idInput.value = v.id;
      // price
      $all('[data-price]', root).forEach(function (el) { el.innerHTML = money(v.price); });
      $all('[data-compare-price]', root).forEach(function (el) {
        if (v.compare_at_price && v.compare_at_price > v.price) { el.hidden = false; el.innerHTML = money(v.compare_at_price); }
        else { el.hidden = true; }
      });
      // availability + button label
      var preorder = root.getAttribute('data-preorder') === 'true';
      $all('[data-add-btn]', root).forEach(function (btn) {
        if (!v.available) { btn.disabled = true; btn.textContent = strings.soldOut; }
        else { btn.disabled = false; btn.textContent = preorder ? strings.preorder : strings.addToCart; }
      });
      // sticky bar sync
      $all('[data-sticky-variant]', root).forEach(function (el) { el.textContent = v.title; });
      // media
      if (v.featured_media) {
        var gallery = $('[data-gallery]', root);
        if (gallery) {
          var target = gallery.querySelector('[data-media-id="' + v.featured_media.id + '"]');
          if (target && target.scrollIntoView) target.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        }
      }
    }
    $all('[data-option-index] input, [data-option-index] select', root).forEach(function (input) {
      input.addEventListener('change', update);
    });
    update();
  }

  /* -------------------- predictive search -------------------- */
  function initSearch(ctx) {
    var wrap = $('[data-predictive]', ctx) || $('[data-predictive]');
    if (!wrap || wrap._bound) return; wrap._bound = true;
    var input = wrap.querySelector('input[type="search"]');
    var results = wrap.querySelector('[data-predictive-results]');
    if (!input || !results || !routes.predictive_search_url) return;
    var t;
    input.addEventListener('input', function () {
      clearTimeout(t);
      var q = input.value.trim();
      if (q.length < 2) { results.hidden = true; results.innerHTML = ''; return; }
      t = setTimeout(function () {
        fetch(routes.predictive_search_url + '?q=' + encodeURIComponent(q) + '&resources[type]=product,article&section_id=predictive-search', { headers: { 'Accept': 'text/html' } })
          .then(function (r) { return r.text(); })
          .then(function (html) {
            var tmp = document.createElement('div'); tmp.innerHTML = html;
            var inner = tmp.querySelector('[data-predictive-inner]');
            results.innerHTML = inner ? inner.innerHTML : '';
            results.hidden = false;
          });
      }, 250);
    });
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) { results.hidden = true; } });
  }

  /* -------------------- sticky product bar visibility -------------------- */
  function initStickyBar() {
    var bar = $('[data-sticky-bar]');
    var anchor = $('[data-sticky-anchor]');
    if (!bar || !anchor || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { bar.classList.toggle('is-visible', !en.isIntersecting && en.boundingClientRect.top < 0); });
    }, { threshold: 0 });
    io.observe(anchor);
  }

  /* -------------------- shop-by-goal carousel -------------------- */
  function initGoalsCarousel(ctx) {
    $all('[data-goals-carousel]', ctx || document).forEach(function (root) {
      if (root.getAttribute('data-goals-ready') === '1') return;
      var track = root.querySelector('[data-goals-track]');
      var prev = root.querySelector('[data-goals-prev]');
      var next = root.querySelector('[data-goals-next]');
      if (!track || !prev || !next) return;
      root.setAttribute('data-goals-ready', '1');

      function cardStep() {
        var card = track.querySelector('.goal-step');
        if (!card) return track.clientWidth * 0.8;
        var styles = window.getComputedStyle(track);
        var gap = parseFloat(styles.columnGap || styles.gap || '16') || 16;
        return card.getBoundingClientRect().width + gap;
      }

      function syncButtons() {
        var max = track.scrollWidth - track.clientWidth - 2;
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= max;
      }

      prev.addEventListener('click', function () {
        track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
      });
      next.addEventListener('click', function () {
        track.scrollBy({ left: cardStep(), behavior: 'smooth' });
      });
      track.addEventListener('scroll', syncButtons, { passive: true });
      window.addEventListener('resize', syncButtons);
      syncButtons();
    });
  }

  /* -------------------- transparent header on homepage -------------------- */
  function initHeaderScroll() {
    var header = $('[data-site-header]');
    if (!header || !document.body.classList.contains('template-index')) return;
    if (header.getAttribute('data-scroll-ready') === '1') return;
    header.setAttribute('data-scroll-ready', '1');
    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* -------------------- media banner play/pause -------------------- */
  function initMediaBanner(ctx) {
    $all('[data-media-banner]', ctx || document).forEach(function (root) {
      if (root.getAttribute('data-media-ready') === '1') return;
      var video = root.querySelector('video');
      var btn = root.querySelector('[data-media-play]');
      if (!video || !btn) return;
      root.setAttribute('data-media-ready', '1');
      var playIcon = btn.querySelector('[data-media-play-icon]');
      var pauseIcon = btn.querySelector('[data-media-pause-icon]');
      function sync() {
        var playing = !video.paused;
        btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
        btn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
        if (playIcon) playIcon.hidden = playing;
        if (pauseIcon) pauseIcon.hidden = !playing;
      }
      btn.addEventListener('click', function () {
        if (video.paused) video.play();
        else video.pause();
        sync();
      });
      video.addEventListener('play', sync);
      video.addEventListener('pause', sync);
      sync();
    });
  }

  /* -------------------- init + Shopify design mode -------------------- */
  function initAll(ctx) {
    initAccordions(ctx);
    initProduct(ctx);
    initSearch(ctx);
    initStickyBar();
    initHeaderScroll();
    initMediaBanner(ctx);
    initGoalsCarousel(ctx);
  }
  document.addEventListener('DOMContentLoaded', function () { initAll(document); });

  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
  document.addEventListener('shopify:section:select', function () {});
})();
