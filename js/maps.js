/* === map-facade (site-tools) ===
   Google Maps that load when you scroll to them, not on page load. The iframe
   keeps its own size and styling but has no src (data-src instead) until the
   map comes into view; a placeholder covers it until then. Tapping "Show map"
   still works for anyone who gets there first.

   Lighthouse never scrolls, so the map stays out of the measured page load. */
(function () {
  function loadMap(wrap) {
    if (!wrap) return null;
    var iframe = wrap.querySelector('iframe[data-src]');
    if (!iframe) return null;
    iframe.src = iframe.getAttribute('data-src');
    iframe.removeAttribute('data-src');
    iframe.removeAttribute('tabindex');
    iframe.removeAttribute('aria-hidden');
    var facade = wrap.querySelector('.map-facade');
    if (facade) facade.remove();
    return iframe;
  }

  function initMapFacades() {
    var wraps = Array.prototype.slice.call(document.querySelectorAll('.map-facade-wrap'));
    if (!wraps.length) return;

    document.querySelectorAll('.map-facade-load').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var frame = loadMap(btn.closest('.map-facade-wrap'));
        if (frame) frame.focus();
      });
    });

    if (!('IntersectionObserver' in window)) {
      wraps.forEach(loadMap);
      return;
    }
    // A little lead time so the map is ready by the time it's actually on screen.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        loadMap(entry.target);
      });
    }, { rootMargin: '200px 0px' });
    wraps.forEach(function (wrap) { io.observe(wrap); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMapFacades);
  } else {
    initMapFacades();
  }
})();
/* === end map-facade === */
