// Fonctionnement hors connexion. Changer le numéro de VERSION à chaque mise à jour de l'application.
const VERSION = 'atelier-v20';
const FICHIERS = [
  './', 'index.html', 'atelier.html', 'accueil.jpg', 'accueil-flou.jpg', 'papy.webp', 'porte-fermee.webp', 'manifest.webmanifest',
  'icone-192.png', 'icone-512.png', 'icone-masque-512.png', 'apple-touch-icon.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Réseau d'abord (pour recevoir les mises à jour), sinon la copie gardée sur le téléphone.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => { const copie = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copie)); return r; })
      .catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('index.html')))
  );
});
