/* ==========================================================================
   Familien-Galerie — gemeinsame Logik für Album-Übersicht und Album-Ansicht.

   Funktionsprinzip: Alben sind einfach Unterordner in /familie/galerie/fotos/.
   Der Ordner selbst wird per IONOS Webspace Explorer angelegt und mit Fotos/
   Videos befüllt — die Seite liest das Apache-Verzeichnisverzeichnis (Options
   +Indexes, siehe fotos/.htaccess) per fetch() aus und baut daraus automatisch
   die Galerie. Kein manuelles Eintragen einzelner Dateien nötig.

   Empfehlung für Ordnernamen: "JJJJ-MM Titel", z. B. "2026-12 Weihnachten" —
   das sorgt für eine saubere, chronologische Sortierung (neueste zuerst).
   ========================================================================== */

(() => {
  const IMG_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
  const VID_EXT = ['mp4', 'mov', 'webm', 'm4v'];

  function extOf(name) {
    const m = /\.([a-z0-9]+)$/i.exec(name);
    return m ? m[1].toLowerCase() : '';
  }
  function isImage(name) { return IMG_EXT.includes(extOf(name)); }
  function isVideo(name) { return VID_EXT.includes(extOf(name)); }
  function isMedia(name) { return isImage(name) || isVideo(name); }

  /**
   * Lädt ein Apache-Verzeichnisverzeichnis (Options +Indexes) und liefert
   * die enthaltenen Einträge als [{ name, href, isDir }].
   */
  async function fetchDirListing(url) {
    // GitHub Pages has no Apache directory listing.
    if (location.hostname.endsWith('.github.io')) {
      const listing = await fetch(url + '_listing.json', { credentials: 'same-origin' });
      if (!listing.ok) throw new Error('Dateiliste nicht erreichbar (' + listing.status + ')');
      return await listing.json();
    }

    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) throw new Error('Verzeichnis nicht erreichbar (' + res.status + ')');
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const anchors = Array.from(doc.querySelectorAll('a[href]'));
    const items = [];
    for (const a of anchors) {
      const href = a.getAttribute('href');
      if (!href) continue;
      if (href.startsWith('?') || href.startsWith('/') || href.startsWith('http')) continue;
      if (href === '../' || href === '..') continue;
      const isDir = href.endsWith('/');
      const name = decodeURIComponent(isDir ? href.slice(0, -1) : href);
      if (name.startsWith('.')) continue;
      items.push({ name, href, isDir });
    }
    return items;
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(c => { if (c) node.appendChild(c); });
    return node;
  }

  window.WGallery = { fetchDirListing, isImage, isVideo, isMedia, extOf, el };
})();
