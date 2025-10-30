const PRECACHE = 'precache-v6';
const PRECACHE_URLS = [
  '/',
  '/css/style.css',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  '/offline.html',
  '/js/taskmanager.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/main.css',
  'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.45/moment-timezone-with-data.min.js'
];

self.addEventListener('install', event => {
  console.log('Service Worker 安裝中');
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker 啟動中');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => cacheNames.filter(name => name !== PRECACHE))
      .then(oldCaches => Promise.all(oldCaches.map(cache => caches.delete(cache))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 跳過非 HTTP
  if (!url.protocol.startsWith('http')) return;

  // 上傳資料夾：network only
  if (url.pathname.startsWith('/uploads/')) {
    console.log('上傳檔案，network-only:', url.pathname);
    event.respondWith(fetch(event.request));
    return;
  }

  // 強制不快取：筆記 API
  if (
    url.pathname.startsWith('/notebook/notes') ||
    /^\/notebook\/edit\/\d+$/.test(url.pathname)
  ) {
    console.log('強制 network + no-cache:', url.pathname);
    event.respondWith(
      fetch(event.request, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }).catch(() => caches.match('/offline.html') || new Response('Offline', { status: 503 }))
    );
    return;
  }

  // 靜態資源：cache-first + 背景更新快取
  if (PRECACHE_URLS.includes(url.pathname) || PRECACHE_URLS.includes(url.href)) {
    console.log('靜態資源，cache-first:', url.href);
    event.respondWith(
      caches.match(event.request).then(cached => {
        // 背景更新快取
        const fetchPromise = fetch(event.request).then(response => {
          if (response && response.status === 200) {
            caches.open(PRECACHE).then(cache => cache.put(event.request, response.clone()));
          }
          return response;
        }).catch(() => cached || caches.match('/offline.html'));

        return cached || fetchPromise;
      }).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // 其他動態請求：network only
  console.log('其他動態請求，network-only:', url.pathname);
  event.respondWith(fetch(event.request));
});

// Push 通知
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: '通知', body: '您有新消息', url: '/' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/images/icon-192x192.png',
      data: { url: data.url }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});