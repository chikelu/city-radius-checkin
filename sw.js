// City Radius Provider Check-in: service worker for lock-screen alerts only (T-34). It does not cache pages or data.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = {}; }
  const title = typeof d.title === 'string' ? d.title.slice(0, 80) : 'City Radius';
  const opts = {
    body: typeof d.body === 'string' ? d.body.slice(0, 160) : 'Open the app to see what is new.',
    tag: typeof d.tag === 'string' ? d.tag.slice(0, 80) : 'city-radius',
    renotify: true, requireInteraction: true,
    icon: 'icon-192.png', badge: 'icon-192.png',
    data: { url: typeof d.url === 'string' ? d.url : './' }
  };
  e.waitUntil(self.registration.showNotification(title, opts));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const scope = self.registration.scope;
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const open = all.find(c => c.url.indexOf(scope) === 0);
    if (open) return open.focus();
    return self.clients.openWindow(scope);
  })());
});
