(function () {
  var thisScript = document.currentScript || (function () {
    var s = document.getElementsByTagName('script');
    return s[s.length - 1];
  })();
  var SCRIPT_DIR = thisScript && thisScript.src ? new URL('./', thisScript.src) : new URL('./', location.href);

  function resolveFromScriptDir(raw) {
    try { return new URL(raw, SCRIPT_DIR).href; } catch (e) { return raw; }
  }

  function normalizePath(u) {
    try {
      var url = (u instanceof URL) ? u : new URL(u, location.href);
      var p = url.pathname.replace(/index\.html?$/i, '');
      if (!p.endsWith('/')) p += '/';
      return p;
    } catch (e) { return ''; }
  }

  // Define the component
  function defineNavbar() {
    if (customElements.get('site-navbar')) return;

    class SiteNavbar extends HTMLElement {
      constructor() {
        super();
        var shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
<style>
  
  .navbar {
    background-color: #2c3e50;
    padding: 0.8rem 1.2rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    position: sticky; 
    top: 0; 
    z-index: 1000;
  }
  .navbar-container {
    max-width: 1000px; margin: auto;
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 0.5rem;
  }
  .nav-logo {
    font-size: 1.2rem; color: white; text-decoration: none;
    font-weight: bold; display: flex; align-items: center; white-space: nowrap;
  }
  .nav-logo:hover { text-decoration: none; }
  .nav-icon { height: 1.2rem; width: 1.2rem; margin-right: 8px; vertical-align: middle; }
  .nav-links { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; color: white; }
  .nav-links a {
    font-weight: 500; font-size: 0.95rem; transition: color 0.3s ease;
    padding-bottom: 0.2rem; border-bottom: 2px solid transparent; cursor: pointer;
    text-decoration: none; color: white;
  }
  .nav-links a:hover { color: #66b2ff; text-decoration: none; }
  .nav-links a.active { border-bottom-color: #66b2ff; color: #66b2ff; }

  .dropdown {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    color: white;
    font-weight: 500;
    font-size: 0.95rem;
    transition: color 0.3s ease;
    padding-bottom: 0.2rem;
    border-bottom: 2px solid transparent;
    cursor: default;
    text-decoration: none;
    color: white;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #2c3e50;
    color: white;
    min-width: 100%;
    box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
    z-index: 999;
    border-radius: 0 0 4px 4px;
  }

  .dropdown-content a {
    display: block;
    padding: 10px;
    text-decoration: none;
    color: white;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }
</style>

<nav class="navbar">
  <div class="navbar-container">
    <a class="nav-logo" href="../index.html" data-rel>
      <img alt="Logo" class="nav-icon" src="../favicon.png" data-rel>
      Joseph Oglio
    </a>
    <div class="nav-links">
      <a id="HomeMenu" href="index.html?page=Home">Games</a>
      <a id="DesktopMenu" href="index.html?page=Desktop">Desktop</a>
      <a id="MobileMenu" href="index.html?page=Mobile">Mobile</a>
      <a id="MultiMenu" href="index.html?page=Multi">Multiplayer</a>
      <a id="A-ZMenu" href="index.html?page=A-Z">A-Z</a>
      <div class="dropdown">
          <span>Archived 
            <svg class="caret-icon" width="10" height="10" viewBox="0 0 12 8" aria-hidden="true">
              <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <div class="dropdown-content">
              <a href='Evolution/Evolution.html'>Evolution</a>
              <a href='Doggo/Doggo.html'>Doggo</a>
              <a href='https://joeman0999.herokuapp.com/'>Star Catcher</a>
              <a href='Love/Love.html'>Love Tap</a>
              <a href='JumpToSpace/JumpToSpace.html'>Jump To Space</a>
              <a href='Breakout/Breakout.html'> Breakout </a>
          </div>
      </div>
      <a id="ChangeLog" href="ChangeLog/ChangeLog.html">Change Log</a>
    </div>
  </div>
</nav>
`;

        function shouldRewrite(val) {
          if (!val) return false;
          // Skip anchors, protocols, and root-absolute paths
          return !/^(#|[a-z]+:|\/\/|\/)/i.test(val);
        }

        shadow.querySelectorAll('a[href], img[src]').forEach(el => {
          if (el.hasAttribute('data-keep')) return;
          if (el.hasAttribute('href')) {
            const raw = el.getAttribute('href');
            if (shouldRewrite(raw)) el.setAttribute('href', resolveFromScriptDir(raw));
          }
          if (el.hasAttribute('src')) {
            const raw = el.getAttribute('src');
            if (shouldRewrite(raw)) el.setAttribute('src', resolveFromScriptDir(raw));
          }
        });

      }
    }

    customElements.define('site-navbar', SiteNavbar);
  }

  defineNavbar();
})();