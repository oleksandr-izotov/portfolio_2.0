// Sends a visitor who prefers German or Russian from an English URL to their
// language's version, before the page paints. It has to run here, in <head>:
// after hydration the English markup is already on screen, and swapping the
// URL under a live router would leave the text and the address disagreeing.
// An external file rather than an inline script, because the CSP is
// script-src 'self'.
(function () {
  var path = location.pathname;
  if (/^\/(de|ru)(\/|$)/.test(path)) return;

  var lang = null;
  try {
    lang = localStorage.getItem('lang');
  } catch (e) {
    // Storage blocked — the browser language decides.
  }
  if (!lang) {
    var browser = (navigator.language || 'en').toLowerCase();
    if (browser.indexOf('ru') === 0 || browser.indexOf('uk') === 0) lang = 'ru';
    else if (browser.indexOf('de') === 0) lang = 'de';
  }
  if (lang !== 'de' && lang !== 'ru') return;

  location.replace('/' + lang + (path === '/' ? '' : path) + location.search + location.hash);
})();
