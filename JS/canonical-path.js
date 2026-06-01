/**
 * Resuelve una ruta a su forma canónica (casing del repo) si existe en CANONICAL_ROUTES.
 */
(function (global) {
  function decodePath(path) {
    try {
      return decodeURIComponent(path);
    } catch {
      return path;
    }
  }

  /** Clave única insensible a mayúsculas: /Horarios, /horarios/ e /Horarios/index.html → /horarios */
  function pathKey(path) {
    let p = decodePath(path);
    if (!p.startsWith('/')) p = '/' + p;
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    if (p.toLowerCase().endsWith('/index.html')) {
      p = p.slice(0, -'/index.html'.length) || '/';
    }
    return p.toLowerCase();
  }

  function routeScore(route) {
    let score = 0;
    if (route.endsWith('/index.html')) score += 10;
    if (route.length > 1 && route.endsWith('/')) score += 5;
    if (route === '/') score -= 5;
    return score;
  }

  function buildIndex(routes) {
    const byKey = new Map();
    for (const route of routes) {
      const key = pathKey(route);
      const prev = byKey.get(key);
      if (!prev || routeScore(route) < routeScore(prev)) {
        byKey.set(key, route);
      }
    }
    return byKey;
  }

  let index = null;

  function getIndex() {
    if (!index) {
      const routes = global.CANONICAL_ROUTES || [];
      index = buildIndex(routes);
    }
    return index;
  }

  function resolve(pathname) {
    const routes = getIndex();
    const key = pathKey(pathname);
    return routes.get(key) || null;
  }

  function needsRedirect(pathname) {
    const canonical = resolve(pathname);
    if (!canonical) return false;
    const current = decodePath(pathname);
    const target = canonical;
    return current !== target;
  }

  global.CanonicalPath = { resolve, needsRedirect, pathKey };
})(typeof window !== 'undefined' ? window : globalThis);
