# Project Structure

```
public/
  css/
    admin.css
    notebook.css
    style.css
  images/
    family-logo-192x192.png
    family-logo-512x512.png
    icon-192x192.png
    icon-512x512.png
  js/
    notebook.js
    taskmanager.js
  manifest.json
  offline.html
  robots.txt
  sitemap.xml
  sw.js
services/
  fileService.js
  mailer.js
  noteService.js
  siteSettingsService.js
  subscriptionService.js
  taskService.js
  userService.js
  wordlistService.js
  wordService.js
views/
  admin/
    dashboard.ejs
    files.ejs
    logs.ejs
    notes.ejs
    settings.ejs
    tasks.ejs
    users.ejs
  partials/
    pwa.ejs
  dashboard.ejs
  dictation.ejs
  error.ejs
  filemanager.ejs
  forgot.ejs
  index.ejs
  login.ejs
  notebook.ejs
  register.ejs
  reset.ejs
  sitemap.ejs
  taskmanager.ejs
.env
.gitignore
app.js
db.js
family-app.conf
init.sql
package.json
README.md
待開發的AI功能.markdown
```



# Selected Files Content

## public/manifest.json

```json
{
  "name": "我們的家庭空間",
  "short_name": "家庭空間",
  "description": "一個專為家庭成員設計的溫馨管理與分享平台，輕鬆管理任務、學習生字和分享檔案",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFE4E1",
  "theme_color": "#FF8A9B",
  "icons": [
    {
      "src": "/images/family-logo-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/family-logo-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "lang": "zh-TW",
  "dir": "ltr"
}
```

## public/offline.html

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>離線</title>
  <link href="/css/style.css" rel="stylesheet">
</head>
<body>
  <div class="container text-center mt-5">
    <h2>您目前處於離線狀態</h2>
    <p>請檢查您的網絡連接，然後重試。</p>
  </div>
</body>
</html>
```

## public/robots.txt

```txt
User-agent: *
Allow: /
Allow: /login
Allow: /register
Disallow: /dashboard
Disallow: /dictation
Disallow: /taskmanager
Disallow: /filemanager
Sitemap: https://www.mysandshome.com/sitemap.xml
```

## public/sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.mysandshome.com/</loc>
    <lastmod>2025-10-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.mysandshome.com/login</loc>
    <lastmod>2025-10-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.mysandshome.com/register</loc>
    <lastmod>2025-10-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## public/sw.js

```js
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
```

## services/siteSettingsService.js

```js
// services/siteSettingsService.js
const { query } = require('../db');

let cachedSettings = null;
let settingsLastLoaded = 0;

async function getAllSettings() {
  const now = Date.now();
  if (!cachedSettings || now - settingsLastLoaded > 10000) {
    const results = await query('SELECT setting_key, setting_value FROM site_settings');
    cachedSettings = {};
    results.forEach(row => {
      cachedSettings[row.setting_key] = row.setting_value;
    });
    settingsLastLoaded = now;
  }
  return cachedSettings;
}

async function updateSetting(key, value) {
  await query(
    'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = CURRENT_TIMESTAMP',
    [key, value, value]
  );
  cachedSettings = null; // 清除快取
  settingsLastLoaded = 0;
}

async function getSetting(key) {
  const settings = await getAllSettings();
  return settings[key] || null;
}

module.exports = { getAllSettings, updateSetting, getSetting };
```

## services/subscriptionService.js

```js
const { query } = require('../db');

// services/subscriptionService.js

async function saveSubscription(userId, subscription) {
  if (!subscription || !subscription.endpoint) {
    console.error('無效的訂閱物件:', { userId, subscription });
    throw new Error('無效的推送訂閱數據');
  }

  // 【刪除這整段檢查】不再跳過「已存在」
  // const existing = await query('SELECT * FROM push_subscriptions WHERE user_id = ? AND JSON_EXTRACT(subscription, "$.endpoint") = ?', [userId, subscription.endpoint]);
  // if (!Array.isArray(existing)) { ... }
  // if (existing.length > 0) { ... return; }

  // 直接插入（允許多設備）
  await query(
    'INSERT INTO push_subscriptions (user_id, subscription) VALUES (?, ?)',
    [userId, JSON.stringify(subscription)]
  );
  console.log('新設備訂閱已儲存:', userId, subscription.endpoint);
}

async function getSubscription(userId) {
  const results = await query('SELECT subscription FROM push_subscriptions WHERE user_id = ?', [userId]);
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('無訂閱記錄');
  }
  return JSON.parse(results[0].subscription);
}

module.exports = { saveSubscription, getSubscription };
```

## services/userService.js

```js
const { query } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function getUserById(id) {
  try {
    const results = await query('SELECT id, username, email, role FROM users WHERE id = ?', [id]);
    console.log('getUserById 查詢結果:', { id, results });
    if (!results || results.length === 0) {
      throw new Error('用戶不存在');
    }
    return results[0];
  } catch (err) {
    console.error('getUserById 錯誤:', { id, error: err.message, stack: err.stack });
    throw err;
  }
}

async function registerUser(username, email, password) {
  try {
    const results = await query('SELECT * FROM users WHERE email = ?', [email]);
    const existing = Array.isArray(results) ? results : []; // 防護：確保 existing 是陣列
    if (existing.length > 0) {
      throw new Error('電郵地址已被使用');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'user']);
    console.log('用戶註冊成功:', { username, email });
  } catch (err) {
    console.error('registerUser 錯誤:', { username, email, error: err.message });
    throw err;
  }
}

async function loginUser(username, password) {
  try {
    const results = await query('SELECT * FROM users WHERE username = ?', [username]);
    console.log('查詢結果:', results);
    if (!results || results.length === 0) {
      throw new Error('用戶名或密碼錯誤');
    }
    const user = results[0];
    if (!user || !user.password) {
      throw new Error('用戶數據不完整');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('用戶名或密碼錯誤');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    console.log('用戶登入成功:', username);
    return token;
  } catch (err) {
    console.error('loginUser Error:', err.message);
    throw err;
  }
}

async function getAllUsers() {
  try {
    const results = await query('SELECT id, username, email, role FROM users');
    console.log('查詢所有用戶結果:', { results });
    return results;
  } catch (err) {
    console.error('getAllUsers 錯誤:', { error: err.message, stack: err.stack });
    throw err;
  }
}

module.exports = { registerUser, loginUser, getUserById, getAllUsers };
```

## views/partials/pwa.ejs

```ejs
<meta name="theme-color" content="#00bfff">
<link rel="manifest" href="/manifest.json">
<script>
  // 檢查是否支持 Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker 註冊成功:', registration);
        })
        .catch(err => {
          console.error('Service Worker 註冊失敗:', err);
        });
    });
  }
</script>
```

## views/dashboard.ejs

```ejs
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/style.css" rel="stylesheet">
  <%- include('partials/pwa') %>
  <title>我們的家庭空間 - 儀表板</title>
</head>
<body>
  <div class="container mt-5">
    <!-- 歡迎標題 -->
    <div class="welcome-message">
      <h2 class="mb-3">歡迎回家，<%= username %>！</h2>
      <p class="mb-0">選擇下方功能開始使用</p>
    </div>

    <!-- 功能卡片區（垂直排列，響應式） -->
    <div class="row justify-content-center g-3 mt-3">
      <div class="col-12 col-sm-6 col-md-4">
        <a href="/dictation" class="btn btn-primary w-100 p-3 d-flex align-items-center justify-content-center" style="height: 70px;">
          背默英文生字
        </a>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <a href="/taskmanager" class="btn btn-primary w-100 p-3 d-flex align-items-center justify-content-center" style="height: 70px;">
          任務管理
        </a>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <a href="/filemanager" class="btn btn-primary w-100 p-3 d-flex align-items-center justify-content-center" style="height: 70px;">
          檔案管理
        </a>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <a href="/notebook" class="btn btn-primary w-100 p-3 d-flex align-items-center justify-content-center" style="height: 70px;">
          筆記本
        </a>
      </div>

      <% if (role === 'admin') { %>
        <div class="col-12 col-sm-6 col-md-4">
          <a href="/admin" class="btn btn-primary w-100 p-3 d-flex align-items-center justify-content-center" style="height: 70px;">
            後台管理
          </a>
        </div>
      <% } %>

      <div class="col-12 col-sm-6 col-md-4">
        <a href="/logout" class="btn btn-secondary w-100 p-3 d-flex align-items-center justify-content-center" style="height: 70px;">
          登出
        </a>
      </div>
    </div>
  </div>
</body>
</html>
```

## views/error.ejs

```ejs
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>錯誤</title></head>
<body><h1>錯誤</h1><p><%= message || '發生未知錯誤' %></p>
<a href="/">回首頁</a></body></html>
```

## views/index.ejs

```ejs
<!DOCTYPE html>
<html lang="zh-TW">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- 動態 SEO 標籤 -->
  <meta name="description"
    content="<%= siteSettings.index_meta_description || '我們的家庭空間 - 一個專為家庭成員設計的溫馨平台，管理任務、學習生字、分享檔案，增進家庭互動！' %>">
  <meta name="keywords" content="<%= siteSettings.index_meta_keywords || '家庭網站, 任務管理, 生字學習, 檔案分享, 家庭互動' %>">
  <meta name="robots" content="index, follow">

  <!-- Open Graph -->
  <meta property="og:title" content="<%= siteSettings.index_og_title || '我們的家庭空間' %>">
  <meta property="og:description"
    content="<%= siteSettings.index_og_description || '一個專為家庭成員設計的溫馨平台，管理任務、學習生字、分享檔案，增進家庭互動！' %>">
  <meta property="og:url" content="https://www.mysandshome.com">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://www.mysandshome.com/images/family-logo-512x512.png">

  <!-- 網站標題 -->
  <title>
    <%= siteSettings.site_title || '我們的家庭空間' %> - 溫馨管理與分享平台
  </title>

  <!-- Favicon & PWA -->
  <link rel="icon" href="/images/family-logo-192x192.png" type="image/png">
  <%- include('partials/pwa') %>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- 自定義樣式 -->
    <link rel="stylesheet" href="/css/style.css">
</head>

<body>

  <!-- 導航欄 -->
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center" href="/">
        <img src="/images/family-logo-192x192.png" alt="Logo" width="32" height="32" class="me-2">
        我們的家庭空間
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="#home">首頁</a></li>
          <li class="nav-item"><a class="nav-link" href="#features">功能</a></li>
          <li class="nav-item"><a class="nav-link" href="#about">關於</a></li>
          <li class="nav-item"><a class="nav-link" href="#contact">聯繫</a></li>
          <!-- 登入：強制粉紅底白字 -->
          <li class="nav-item">
            <a class="nav-link btn btn-primary-nav ms-2 px-3" href="/login">登入</a>
          </li>
          <!-- 註冊：強制粉紅底白字 -->
          <li class="nav-item">
            <a class="nav-link btn btn-primary-nav ms-2 px-3" href="/register">註冊</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- 首頁英雄區 -->
  <section id="home" class="vh-100 d-flex align-items-center justify-content-center text-center"
    style="padding-top: 76px;">
    <div class="container">
      <div class="welcome-message p-5">
        <img src="/images/family-logo-192x192.png" alt="Family Logo" class="family-logo mb-4">
        <h1 class="display-4 fw-bold mb-4">歡迎來到我們的家庭空間</h1>
        <p class="lead mb-4">一個專為家庭成員打造的溫馨平台<br>讓我們一起管理任務、學習生字、分享美好時刻！</p>
        <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <a href="/register" class="btn btn-primary btn-lg px-5">立即加入家庭</a>
          <a href="/login" class="btn btn-outline-light btn-lg px-5">登入使用</a>
        </div>
      </div>
    </div>
  </section>

  <!-- 功能區塊 -->
  <section id="features" class="py-5 bg-light">
    <div class="container">
      <h2 class="text-center mb-5">家庭共享功能</h2>
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card h-100 p-4 text-center hover-shadow">
            <div class="mb-3">
              <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                style="width: 60px; height: 60px;">
                <i class="bi bi-book"></i>
              </div>
            </div>
            <h3 class="text-info">生字學習</h3>
            <p class="text-muted">為孩子和家人創建專屬英文生字庫，支援背默、複習與進度追蹤。</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 p-4 text-center hover-shadow">
            <div class="mb-3">
              <div class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                style="width: 60px; height: 60px;">
                <i class="bi bi-check2-square"></i>
              </div>
            </div>
            <h3 class="text-info">家庭任務</h3>
            <p class="text-muted">日曆提醒 + 任務清單，讓家務、活動、待辦事項一目了然。</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 p-4 text-center hover-shadow">
            <div class="mb-3">
              <div class="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center"
                style="width: 60px; height: 60px;">
                <i class="bi bi-cloud-upload"></i>
              </div>
            </div>
            <h3 class="text-info">檔案分享</h3>
            <p class="text-muted">安全上傳照片、文件、學習資料，隨時隨地存取與分享。</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 p-4 text-center hover-shadow">
            <div class="mb-3">
              <div class="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                style="width: 60px; height: 60px;">
                <i class="bi bi-journal-text"></i>
              </div>
            </div>
            <h3 class="text-info">家庭筆記本</h3>
            <p class="text-muted">支援 Markdown、標籤、置頂、分享，記錄生活點滴與靈感。</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 p-4 text-center hover-shadow">
            <div class="mb-3">
              <div class="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                style="width: 60px; height: 60px;">
                <i class="bi bi-bell"></i>
              </div>
            </div>
            <h3 class="text-info">即時提醒</h3>
            <p class="text-muted">任務到期自動推送通知，支援離線使用與 PWA 安裝。</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 p-4 text-center hover-shadow">
            <div class="mb-3">
              <div
                class="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                style="width: 60px; height: 60px;">
                <i class="bi bi-shield-lock"></i>
              </div>
            </div>
            <h3 class="text-info">安全私密</h3>
            <p class="text-muted">所有資料加密儲存，僅限家庭成員存取，安心使用。</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 關於區塊 -->
  <section id="about" class="py-5">
    <div class="container">
      <h2 class="text-center mb-5">關於我們的家庭空間</h2>
      <div class="row align-items-center">
        <div class="col-md-6">
          <p class="lead">我們的家庭空間是一個專為家庭成員設計的平台，幫助您：</p>
          <ul class="list-unstyled">
            <li class="mb-2"><strong>學習成長：</strong> 生字背默、知識整理</li>
            <li class="mb-2"><strong>生活管理：</strong> 任務提醒、日曆同步</li>
            <li class="mb-2"><strong>記憶保存：</strong> 照片、文件、筆記分享</li>
            <li class="mb-2"><strong>離線可用：</strong> PWA 技術，隨時隨地使用</li>
          </ul>
          <p>結合現代技術與溫馨設計，讓科技成為家庭連結的橋樑。</p>
        </div>
        <div class="col-md-6 text-center">
          <img src="/images/family-logo-512x512.png" alt="Family App" class="img-fluid rounded shadow"
            style="max-width: 300px;">
        </div>
      </div>
    </div>
  </section>

  <!-- 聯繫區塊 -->
  <section id="contact" class="py-5 bg-light">
    <div class="container">
      <h2 class="text-center mb-5">聯繫我們</h2>
      <div class="text-center">
        <p class="lead mb-4">有任何問題或建議？歡迎隨時告訴我們！</p>
        <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
          <a href="mailto:support@mysandshome.com" class="btn btn-outline-primary px-4">
            <i class="bi bi-envelope"></i> support@mysandshome.com
          </a>
          <a href="https://github.com/thisismak" target="_blank" class="btn btn-outline-dark px-4">
            <i class="bi bi-github"></i> GitHub
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- 頁尾 -->
  <footer class="text-center py-4 bg-dark text-light">
    <div class="container">
      <p class="mb-0">&copy; 2025 我們的家庭空間. All Rights Reserved.</p>
      <small class="text-muted">Made with <span style="color: #e25555;">♥</span> for Family</small>
    </div>
  </footer>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

  <!-- 可選：加入 Bootstrap Icons -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
</body>

</html>
```

## views/login.ejs

```ejs
<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link href="/css/style.css" rel="stylesheet" />
    <%- include('partials/pwa') %>
    <title>我們的家庭空間 - 登入</title>
  </head>
  <body>
    <div class="container mt-5 login">
      <h2 class="text-center mb-5">我們的家庭空間 - 登入</h2>
      <% if (error) { %>
      <div class="alert alert-danger" role="alert"><%= error %></div>
      <% } %>
      <form action="/login" method="POST" class="card p-4 mb-4">
        <div class="mb-3">
          <label for="username" class="form-label text-info">用戶名</label>
          <input
            type="text"
            id="username"
            name="username"
            class="form-control text-input"
            placeholder="輸入用戶名"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label text-info">密碼</label>
          <input
            type="password"
            id="password"
            name="password"
            class="form-control text-input"
            placeholder="輸入密碼"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">登入</button>
      </form>
      <div class="text-center mt-4">
        <p>還沒有帳號？ <a href="/register" class="text-info">立即註冊</a></p>
      </div>
      <!-- 在登入表單下方 -->
      <div class="text-center mt-3">
        <a href="/forgot" class="text-info">忘記密碼？</a>
      </div>
    </div>
  </body>
</html>
```

## views/register.ejs

```ejs
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/style.css" rel="stylesheet">
  <%- include('partials/pwa') %>
  <title>我們的家庭空間 - 註冊</title>
</head>
<body>
  <div class="container mt-5 register">
    <h2 class="text-center mb-5">我們的家庭空間 - 註冊</h2>
    <% if (error) { %>
      <div class="alert alert-danger" role="alert"><%= error %></div>
    <% } %>
    <form action="/register" method="POST" class="card p-4 mb-4">
      <div class="mb-3">
        <label for="username" class="form-label text-info">用戶名</label>
        <input type="text" id="username" name="username" class="form-control text-input" placeholder="輸入用戶名" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label text-info">電郵地址</label>
        <input type="email" id="email" name="email" class="form-control text-input" placeholder="輸入電郵地址" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label text-info">密碼</label>
        <input type="password" id="password" name="password" class="form-control text-input" placeholder="輸入密碼" required>
      </div>
      <button type="submit" class="btn btn-primary w-100">註冊</button>
    </form>
    <div class="text-center mt-4">
      <p>已有帳號？ <a href="/login" class="text-info">返回登入</a></p>
    </div>
  </div>
</body>
</html>
```

## views/sitemap.ejs

```ejs
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.mysandshome.com/</loc>
    <lastmod><%= new Date().toISOString().split('T')[0] %></lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.mysandshome.com/login</loc>
    <lastmod><%= new Date().toISOString().split('T')[0] %></lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.mysandshome.com/register</loc>
    <lastmod><%= new Date().toISOString().split('T')[0] %></lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## .env

```
# === 資料庫 ===
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=sam1_sql_password
DB_NAME=internal_website

# === JWT & Port ===
JWT_SECRET=your_jwt_secret_key_here_change_it
PORT=3000

# === VAPID (Web Push) ===
VAPID_PUBLIC_KEY=BCUBSpo6Y0Q8QUKduPAWXSwcvlElJbg5_PZDiXYJf1JC8sS3lCODMs_IiFDahD0LtlimMBqZj1G7lH61eVJMGeY
VAPID_PRIVATE_KEY=bwXEQHcZYH2FUQ2_NKtAxorzjh-l8Dkrrro79bpjRn4

# === 郵件設定（使用本機 Postfix 中繼）===
MAIL_HOST=127.0.0.1
MAIL_PORT=25
MAIL_SECURE=false
MAIL_USER=
MAIL_PASS=
MAIL_FROM=testing.email111011@gmail.com
```

## app.js

```js
require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const webpush = require('web-push');
const moment = require('moment-timezone');
const { initializeDatabase, query } = require('./db');
const userService = require('./services/userService');
const wordlistService = require('./services/wordlistService');
const wordService = require('./services/wordService');
const taskService = require('./services/taskService');
const subscriptionService = require('./services/subscriptionService');
const fileService = require('./services/fileService');
const noteService = require('./services/noteService');
const siteSettingsService = require('./services/siteSettingsService');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

process.env.TZ = 'Asia/Hong_Kong';

const app = express();
const JWT_EXPIRES_IN = '7d';

// 快取站點設定
let cachedSettings = null;
let settingsLastLoaded = 0;
const SETTINGS_CACHE_TTL = 5 * 60 * 1000; // 5分鐘

// Multer 檔案上傳
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fileService.ensureUploadDir();
      cb(null, 'public/uploads/');
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png',
      'application/pdf', 'text/plain', 'text/csv'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('僅支援 JPEG、PNG、PDF、TXT、CSV 檔案'));
    }
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public', {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.xml')) {
      res.setHeader('Content-Type', 'application/xml');
    }
  }
}));
app.set('view engine', 'ejs');

// VAPID 設定
webpush.setVapidDetails(
  'mailto:support@mysandshome.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// 全局 res.locals 防護
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.error = null;
  next();
});

initializeDatabase().catch(err => {
  console.error('資料庫初始化失敗:', err.message);
  process.exit(1);
});

// 載入站點設定（快取）
async function loadSiteSettings(force = false) {
  const now = Date.now();
  if (!force && cachedSettings && (now - settingsLastLoaded < SETTINGS_CACHE_TTL)) {
    return cachedSettings;
  }

  try {
    const results = await query('SELECT setting_key, setting_value FROM site_settings');
    const settings = {};
    results.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    cachedSettings = settings;
    settingsLastLoaded = now;
    return settings;
  } catch (err) {
    console.error('載入站點設定失敗:', err.message);
    return {
      site_title: '家庭內部網站',
      vapid_public_key: process.env.VAPID_PUBLIC_KEY || '',
      index_meta_description: '家庭內部網站，提供生字背默、任務管理、檔案管理與家庭筆記功能。',
      index_meta_keywords: '家庭, 學習, 任務, 檔案, 筆記',
      index_og_title: '家庭內部網站',
      index_og_description: '家庭成員共享的學習與管理平台。',
      login_meta_description: '登入家庭內部網站',
      login_meta_keywords: '登入, 家庭',
      login_og_title: '登入',
      login_og_description: '登入您的帳戶',
      register_meta_description: '註冊家庭帳戶',
      register_meta_keywords: '註冊, 家庭',
      register_og_title: '註冊',
      register_og_description: '建立新帳戶'
    };
  }
}

// 活動日誌（容錯）
async function logActivity(userId, action, details, req = null) {
  try {
    const ip = req?.headers['x-forwarded-for']?.split(',')[0]?.trim() || req?.ip || 'unknown';
    const ua = req?.headers['user-agent'] || 'unknown';
    await query(
      'INSERT INTO activity_logs (user_id, action, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [userId || null, action, details, ip, ua]
    );
  } catch (err) {
    if (!err.message.includes('Unknown column')) {
      console.error('日誌記錄失敗:', err.message);
    }
  }
}

// JWT 驗證
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = decoded;
    next();
  } catch (err) {
    console.warn('JWT 無效:', err.message);
    res.clearCookie('token');
    res.redirect('/login');
  }
};

// 管理員驗證
const verifyAdmin = (req, res, next) => {
  userService.getUserById(req.user.id)
    .then(user => {
      if (user && user.role === 'admin') {
        req.user = user;
        next();
      } else {
        res.status(403).send('<h1>403 禁止存取</h1>');
      }
    })
    .catch(err => {
      console.error('verifyAdmin 錯誤:', err.message);
      res.redirect('/login');
    });
};

// === 密碼重設 Token 管理 ===
async function generateResetToken(email) {
  const results = await query('SELECT id FROM users WHERE email = ?', [email]);
  if (!results || results.length === 0) {
    throw new Error('此電郵未註冊');
  }
  const userId = results[0].id;
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1小時

  await query(
    'UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?',
    [token, expires, userId]
  );

  return { token, userId };
}

async function validateResetToken(token) {
  const results = await query(
    'SELECT id FROM users WHERE reset_token = ? AND reset_expires > NOW()',
    [token]
  );
  if (!results || results.length === 0) return null;
  return results[0].id;
}

async function updatePassword(userId, password) {
  const hashed = await bcrypt.hash(password, 10);
  await query(
    'UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
    [hashed, userId]
  );
}

// ==================== 公開路由 ====================

app.get('/', async (req, res) => {
  const settings = await loadSiteSettings();
  res.render('index', { siteSettings: settings, error: null });
});

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const settings = await loadSiteSettings();
    res.header('Content-Type', 'application/xml');
    res.render('sitemap', { settings, error: null });
  } catch (err) {
    console.error('生成網站地圖失敗:', err.message);
    res.status(500).render('error', { message: '生成網站地圖失敗', error: err.message });
  }
});

app.get('/register', async (req, res) => {
  const settings = await loadSiteSettings();
  res.render('register', { error: null, siteSettings: settings });
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await userService.registerUser(username, email, password);
    await logActivity(null, '用戶註冊', `新用戶: ${username} (${email})`, req);
    res.redirect('/login');
  } catch (err) {
    const settings = await loadSiteSettings();
    res.render('register', { error: err.message, siteSettings: settings });
  }
});

app.get('/login', async (req, res) => {
  const settings = await loadSiteSettings();
  res.render('login', { error: null, siteSettings: settings });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await userService.loginUser(username, password);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    await logActivity(null, '用戶登入', `用戶 ${username} 登入`, req);
    res.redirect('/dashboard');
  } catch (err) {
    const settings = await loadSiteSettings();
    res.render('login', { error: err.message, siteSettings: settings });
  }
});

// === 刪除這一行 ===
// const { generateResetToken, validateResetToken, updatePassword } = require('./services/userService');
const { sendResetEmail } = require('./services/mailer');

/* ---------- 忘記密碼 ---------- */
app.get('/forgot', async (req, res) => {
  const settings = await loadSiteSettings();
  res.render('forgot', { error: null, success: null, siteSettings: settings });
});

app.post('/forgot', async (req, res) => {
  const { email } = req.body;
  try {
    const { token } = await generateResetToken(email);
    const resetLink = `https://www.mysandshome.com/reset/${token}`;
    await sendResetEmail(email, resetLink);
    const settings = await loadSiteSettings();
    res.render('forgot', {
      success: '重設連結已寄至您的電郵，請查收！',
      error: null,
      siteSettings: settings
    });
  } catch (err) {
    const settings = await loadSiteSettings();
    res.render('forgot', { error: err.message, success: null, siteSettings: settings });
  }
});

/* ---------- 重設密碼 ---------- */
app.get('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const userId = await validateResetToken(token);
  if (!userId) {
    return res.render('error', { message: '連結無效或已過期', error: null });
  }
  const settings = await loadSiteSettings();
  res.render('reset', { token, error: null, siteSettings: settings });
});

app.post('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { password, confirm } = req.body;

  if (password !== confirm) {
    return res.render('reset', { token, error: '兩次密碼不一致' });
  }
  if (password.length < 6) {
    return res.render('reset', { token, error: '密碼至少 6 位' });
  }

  const userId = await validateResetToken(token);
  if (!userId) {
    return res.render('error', { message: '連結無效或已過期', error: null });
  }

  try {
    await updatePassword(userId, password);
    res.redirect('/login?msg=密碼已成功重設，請重新登入');
  } catch (err) {
    res.render('reset', { token, error: err.message });
  }
});

// ...（後面所有路由保持不變，全部照抄）
// 包含管理員、dashboard、taskmanager、filemanager、notebook 等全部路由
// 以及推播、錯誤處理、listen 全部不動

// ==================== 管理員後台路由 ====================

app.get('/admin', verifyToken, verifyAdmin, (req, res) => {
  Promise.all([
    query('SELECT COUNT(*) as count FROM users').then(r => r[0].count || 0),
    query('SELECT COUNT(*) as count FROM tasks WHERE due_date > NOW()').then(r => r[0].count || 0),
    query('SELECT COUNT(*) as count FROM files').then(r => r[0].count || 0),
    query('SELECT COUNT(*) as count FROM notes').then(r => r[0].count || 0)
  ])
    .then(([userCount, taskCount, fileCount, noteCount]) => {
      res.render('admin/dashboard', {
        stats: [userCount, taskCount, fileCount, noteCount],
        username: req.user.username,
        error: null
      });
    })
    .catch(err => {
      console.error('載入儀表板失敗:', err);
      res.status(500).render('error', { message: '載入失敗', error: err.message });
    });
});

app.get('/admin/settings', verifyToken, verifyAdmin, (req, res) => {
  siteSettingsService.getAllSettings()
    .then(settings => res.render('admin/settings', { settings, error: null }))
    .catch(err => res.status(500).render('error', { message: '載入設定失敗', error: err.message }));
});

app.post('/admin/settings', verifyToken, verifyAdmin, (req, res) => {
  const { key, value } = req.body;
  if (!key) return res.status(400).json({ error: '缺少 key' });
  siteSettingsService.updateSetting(key, value)
    .then(() => {
      cachedSettings = null;
      res.json({ success: true });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/admin/users', verifyToken, verifyAdmin, (req, res) => {
  query(`
    SELECT u.id, u.username, u.email, u.role, u.created_at 
    FROM users u 
    ORDER BY u.created_at DESC
  `)
    .then(users => res.render('admin/users', { users, error: null }))
    .catch(err => {
      console.error('載入使用者失敗:', err);
      res.status(500).render('error', { message: '載入使用者失敗', error: err.message });
    });
});

app.get('/admin/files', verifyToken, verifyAdmin, (req, res) => {
  query(`
    SELECT f.*, u.username 
    FROM files f 
    JOIN users u ON f.user_id = u.id 
    ORDER BY f.uploaded_at DESC
  `)
    .then(files => res.render('admin/files', { files, error: null }))
    .catch(err => {
      console.error('載入檔案失敗:', err);
      res.status(500).render('error', { message: '載入檔案失敗', error: err.message });
    });
});

app.get('/admin/notes', verifyToken, verifyAdmin, (req, res) => {
  query(`
    SELECT n.*, u.username 
    FROM notes n 
    JOIN users u ON n.user_id = u.id 
    ORDER BY n.updated_at DESC
  `)
    .then(notes => res.render('admin/notes', { notes, error: null }))
    .catch(err => {
      console.error('載入筆記失敗:', err);
      res.status(500).render('error', { message: '載入筆記失敗', error: err.message });
    });
});

app.get('/admin/tasks', verifyToken, verifyAdmin, (req, res) => {
  query(`
    SELECT t.*, u.username 
    FROM tasks t 
    JOIN users u ON t.user_id = u.id 
    ORDER BY t.due_date DESC
  `)
    .then(tasks => res.render('admin/tasks', { tasks, error: null }))
    .catch(err => {
      console.error('載入任務失敗:', err);
      res.status(500).render('error', { message: '載入任務失敗', error: err.message });
    });
});

app.get('/admin/logs', verifyToken, verifyAdmin, (req, res) => {
  query('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 100')
    .then(logs => res.render('admin/logs', { logs, error: null }))
    .catch(err => res.status(500).render('error', { message: '載入失敗', error: err.message }));
});

app.get('/admin/backup', verifyToken, verifyAdmin, (req, res) => {
  const file = `backup_${moment().format('YYYYMMDD_HHmmss')}.sql`;
  const cmd = `mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${file}`;
  execPromise(cmd)
    .then(() => {
      res.download(file, () => fs.unlink(file).catch(() => { }));
    })
    .catch(err => {
      res.status(500).send('備份失敗：' + err.message);
    });
});

app.post('/admin/clear-cache', verifyToken, verifyAdmin, (req, res) => {
  cachedSettings = null;
  settingsLastLoaded = 0;
  res.json({ success: true, message: '快取已清除' });
});

// ==================== 其他登入後路由 ====================

app.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) throw new Error('用戶不存在');
    await logActivity(req.user.id, '訪問儀表板', '進入 Dashboard', req);
    res.render('dashboard', {
      username: user.username || '未知用戶',
      role: user.role || 'user',
      error: null
    });
  } catch (err) {
    console.error('載入 dashboard 錯誤:', err.message);
    res.clearCookie('token');
    res.redirect('/login?error=session_expired');
  }
});

app.get('/dictation', verifyToken, async (req, res) => {
  try {
    const wordlists = await wordlistService.getWordlists(req.user.id) || [];
    res.render('dictation', { wordlists, error: null });
  } catch (err) {
    console.error('載入 dictation 失敗:', err.message);
    res.render('dictation', { wordlists: [], error: '載入生字背默失敗，請稍後再試' });
  }
});

app.post('/dictation/save', verifyToken, async (req, res) => {
  const { wordlistName, words } = req.body;
  if (!wordlistName || !words || !Array.isArray(words)) {
    console.warn('/dictation/save invalid request body:', req.body);
    return res.status(400).json({ success: false, error: '請提供生字庫名稱和有效的生字列表' });
  }
  try {
    const wordlistId = await wordlistService.createWordlist(req.user.id, wordlistName, words);
    res.json({ success: true, wordlistId });
  } catch (err) {
    // 詳細記錄錯誤以利除錯
    console.error('/dictation/save error:', err && err.stack ? err.stack : err);
    const msg = process.env.NODE_ENV === 'production' ? '儲存生字庫失敗' : (err && err.message ? err.message : String(err));
    res.status(500).json({ success: false, error: msg });
  }
});

// 新增：取得指定生字庫的生字（僅允許擁有者）
app.get('/dictation/words/:id', verifyToken, async (req, res) => {
  const wordlistId = Number(req.params.id);
  if (!Number.isInteger(wordlistId) || wordlistId <= 0) {
    return res.status(400).json({ error: 'invalid id' });
  }

  try {
    console.log(`[DEBUG] /dictation/words request: user=${req.user?.id} wordlistId=${wordlistId}`);
    // 確認屬於當前使用者
    const ownerCheck = await query('SELECT id, user_id FROM wordlists WHERE id = ? AND user_id = ?', [wordlistId, req.user.id]);
    console.log('[DEBUG] ownerCheck result:', ownerCheck);
    if (!ownerCheck || ownerCheck.length === 0) {
      return res.status(404).json({ error: 'not found' });
    }

    const words = await wordlistService.getWords(wordlistId);
    res.json(Array.isArray(words) ? words : []);
  } catch (err) {
    console.error('/dictation/words/:id error:', err && err.stack ? err.stack : err);
    res.status(500).json({ error: '載入生字失敗' });
  }
});

app.delete('/dictation/wordlist/:id', verifyToken, async (req, res) => {
  const wordlistId = Number(req.params.id);
  if (!Number.isInteger(wordlistId) || wordlistId <= 0) {
    return res.status(400).json({ success: false, error: 'invalid id' });
  }

  try {
    console.log(`[DEBUG] DELETE /dictation/wordlist request: user=${req.user?.id} wordlistId=${wordlistId}`);
    const ownerCheck = await query('SELECT id FROM wordlists WHERE id = ? AND user_id = ?', [wordlistId, req.user.id]);
    if (!ownerCheck || ownerCheck.length === 0) {
      return res.status(404).json({ success: false, error: 'not found' });
    }

    await wordlistService.deleteWordlist(wordlistId, req.user.id);
    res.json({ success: true });
  } catch (err) {
    console.error('/dictation/wordlist/:id DELETE error:', err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, error: '刪除生字庫失敗，請稍後重試' });
  }
});

app.post('/dictation/word/:id', verifyToken, async (req, res) => {
  const wordlistId = Number(req.params.id);
  const { english = '', chinese = '' } = req.body;

  if (!Number.isInteger(wordlistId) || wordlistId <= 0) {
    return res.status(400).json({ success: false, error: 'invalid id' });
  }
  if (!english || !chinese) {
    return res.status(400).json({ success: false, error: '請提供 english 與 chinese' });
  }

  try {
    // 確認擁有權
    const ownerCheck = await query('SELECT id FROM wordlists WHERE id = ? AND user_id = ?', [wordlistId, req.user.id]);
    if (!ownerCheck || ownerCheck.length === 0) {
      return res.status(404).json({ success: false, error: 'not found' });
    }

    const insertedId = await wordlistService.addWord(wordlistId, english.trim(), chinese.trim());
    res.status(201).json({ success: true, id: insertedId });
  } catch (err) {
    console.error('/dictation/word/:id POST error:', err && err.stack ? err.stack : err);
    const msg = err && err.message ? err.message : '新增生字失敗';
    res.status(500).json({ success: false, error: msg });
  }
});

app.put('/dictation/words/:id', verifyToken, async (req, res) => {
  const wordlistId = Number(req.params.id);
  const { words } = req.body;

  if (!Number.isInteger(wordlistId) || wordlistId <= 0) {
    return res.status(400).json({ success: false, error: 'invalid id' });
  }

  try {
    // 確認擁有權
    const ownerCheck = await query('SELECT id FROM wordlists WHERE id = ? AND user_id = ?', [wordlistId, req.user.id]);
    if (!ownerCheck || ownerCheck.length === 0) {
      return res.status(404).json({ success: false, error: 'not found' });
    }

    await wordlistService.updateWords(wordlistId, words);
    res.json({ success: true });
  } catch (err) {
    console.error('/dictation/words/:id PUT error:', err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, error: '更新生字失敗，請稍後重試' });
  }
});

app.get('/taskmanager', verifyToken, async (req, res) => {
  try {
    const settings = await loadSiteSettings();
    const vapidKey = settings.vapid_public_key || process.env.VAPID_PUBLIC_KEY || '';
    const tasks = await taskService.getTasks(req.user.id) || [];
    res.render('taskmanager', {
      VAPID_PUBLIC_KEY: vapidKey,
      tasks: tasks,
      error: null
    });
  } catch (err) {
    console.error('載入 taskmanager 失敗:', err.message);
    res.render('taskmanager', {
      VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY || '',
      tasks: [],
      error: '載入任務管理失敗，請稍後再試'
    });
  }
});

app.get('/taskmanager/tasks', verifyToken, async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.user.id) || [];
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/taskmanager/add', verifyToken, async (req, res) => {
  const { title, description, due_date } = req.body;
  try {
    const id = await taskService.addTask(req.user.id, title, description, due_date);
    res.set('Cache-Control', 'no-cache');
    res.json({ success: true, id });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/taskmanager/edit/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date } = req.body;
  try {
    await taskService.editTask(req.user.id, id, title, description, due_date);
    res.set('Cache-Control', 'no-cache');
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/taskmanager/delete/:id', verifyToken, async (req, res) => {
  const taskId = Number(req.params.id);
  const userId = Number(req.user.id);

  if (!taskId || !userId) {
    return res.status(400).json({ success: false, error: '無效的 ID' });
  }

  console.log('[DELETE] 請求刪除任務:', { taskId, userId });

  try {
    await taskService.deleteTask(userId, taskId);
    console.log('[DELETE] 刪除成功:', taskId);
    res.json({ success: true });
  } catch (err) {
    console.error('[DELETE] 刪除失敗:', err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/filemanager', verifyToken, async (req, res) => {
  try {
    const files = await fileService.getFiles(req.user.id) || [];
    res.render('filemanager', { files, error: null });
  } catch (err) {
    console.error('載入 filemanager 失敗:', err);
    res.render('filemanager', { files: [], error: '載入失敗' });
  }
});

app.get('/filemanager/files', verifyToken, async (req, res) => {
  try {
    const files = await fileService.getFiles(req.user.id) || [];
    res.json(files);
  } catch (err) {
    console.error('API 載入檔案失敗:', err);
    res.status(500).json({ error: '載入檔案失敗' });
  }
});

app.post('/filemanager/upload', verifyToken, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: '請選擇檔案' });

  const { customName, description = '' } = req.body;
  if (!customName?.trim()) return res.status(400).json({ error: '請輸入檔案名稱' });

  try {
    await fileService.saveFile(
      req.user.id,
      req.file.filename,
      req.file.originalname,
      customName.trim(),
      description.trim()
    );
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/filemanager/edit/:filename', verifyToken, async (req, res) => {
  const { filename } = req.params;
  const { customName, description } = req.body;
  try {
    await fileService.editFile(req.user.id, filename, customName, description);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/filemanager/delete/:filename', verifyToken, async (req, res) => {
  const { filename } = req.params;
  try {
    await fileService.deleteFile(req.user.id, filename);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/notebook', verifyToken, async (req, res) => {
  try {
    const settings = await loadSiteSettings();
    const notes = await noteService.getNotes(req.user.id) || [];
    const tags = await noteService.getTags(req.user.id) || [];

    res.render('notebook', {
      siteSettings: settings,
      notes: notes,
      tags: tags,
      error: null
    });
  } catch (err) {
    console.error('載入 notebook 失敗:', err.message);
    const settings = await loadSiteSettings().catch(() => ({}));
    res.render('notebook', {
      siteSettings: settings,
      notes: [],
      tags: [],
      error: '載入記事本失敗，請稍後再試'
    });
  }
});

app.get('/notebook/notes', verifyToken, async (req, res) => {
  const { search = '', tag = '', sort = 'updated' } = req.query;
  try {
    const notes = await noteService.getNotes(req.user.id, search, tag || null, sort);
    res.json(notes);
  } catch (err) {
    console.error('載入筆記失敗:', err);
    res.status(500).json({ error: '載入筆記失敗' });
  }
});

app.post('/notebook/add', verifyToken, async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const id = await noteService.createNote(req.user.id, title, content, tags);
    res.json({ success: true, id });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/notebook/edit/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;
  try {
    await noteService.updateNote(req.user.id, id, title, content, tags);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/notebook/pin/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await noteService.togglePin(id, req.user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/notebook/delete/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await noteService.deleteNote(req.user.id, id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/notebook/share/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const url = await noteService.createShareLink(id, req.user.id);
    res.json({ success: true, url });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/subscribe', verifyToken, async (req, res) => {
  const subscription = req.body;
  try {
    await subscriptionService.saveSubscription(req.user.id, subscription);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/logout', async (req, res) => {
  await logActivity(req.user?.id, '用戶登出', `用戶ID: ${req.user?.id}`, req);
  res.clearCookie('token');
  res.redirect('/login');
});

app.use((err, req, res, next) => {
  console.error('未處理錯誤:', err);
  logActivity(req.user?.id, '系統錯誤', err.message, req).catch(() => { });
  res.status(500).render('error', { message: '伺服器錯誤', error: err.message });
});

app.use((req, res) => {
  res.status(404).render('error', { message: '頁面不存在', error: null });
});

setInterval(async () => {
  console.log('[PUSH] 排程器啟動，檢查即將到期任務...');
  try {
    const tasks = await taskService.checkUpcomingTasks();
    console.log(`[PUSH] 找到 ${tasks.length} 筆即將到期任務`);

    for (const task of tasks) {
      const subscriptions = task.subscriptions || [];

      const payload = JSON.stringify({
        title: '任務提醒',
        body: `${task.title} 即將到期！`,
        url: '/taskmanager'
      });

      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification(sub, payload);
          console.log(`[PUSH] 發送成功: user ${task.user_id}, task ${task.id}, endpoint: ${sub.endpoint.substring(0, 50)}...`);
        } catch (err) {
          if (err.statusCode === 410 || err.statusCode === 404) {
            await query('DELETE FROM push_subscriptions WHERE JSON_EXTRACT(subscription, "$.endpoint") = ?', [sub.endpoint]);
            console.log(`[PUSH] 訂閱過期已刪除: ${sub.endpoint.substring(0, 50)}...`);
          } else {
            console.error('[PUSH] 發送失敗:', err.message);
          }
        }
      }

      await taskService.markTaskAsNotified(task.id);
    }
  } catch (err) {
    console.error('[PUSH] 錯誤:', err.message);
  }
}, 30000);

console.log('[PUSH] 排程器已啟動，每 30 秒檢查一次');

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
```

## db.js

```js
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+08:00'
});

async function query(sql, params) {
  try {
    const [results, fields] = await pool.query(sql, params);
    console.log('SQL 查詢成功:', { sql, params, results });
    return sql.trim().toUpperCase().startsWith('SELECT') ? (Array.isArray(results) ? results : []) : results;
  } catch (err) {
    console.error('Query Error:', { sql, params, error: err.message, stack: err.stack });
    throw err;
  }
}

async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    const sql = await fs.readFile('init.sql', 'utf8');
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const statement of statements) {
      await connection.query(statement);
    }
    console.log('Database initialized successfully');
    connection.release();
  } catch (err) {
    console.error('Database Initialization Error:', err.message);
    throw err;
  }
}

module.exports = { pool, query, initializeDatabase };
```

## family-app.conf

```conf
# 原本文在/etc/nginx/conf.d/family-app.conf
server {
    server_name www.mysandshome.com;

    # 為 manifest.json 設置正確的 MIME 類型
    location = /manifest.json {
        add_header Content-Type application/json;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 為 sw.js 設置正確的 MIME 類型
    location = /sw.js {
        add_header Content-Type application/javascript;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 其他請求
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/mysandshome.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mysandshome.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    ssl_ecdh_curve prime256v1:secp384r1:secp521r1;
}

server {
    listen 80;
    server_name www.mysandshome.com;
    if ($host = www.mysandshome.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
    return 404; # managed by Certbot
}
```

## init.sql

```sql
-- 初始化資料庫結構和預設數據
-- 適用於 internal_website 資料庫，確保與現有系統兼容
-- 版本：家庭版 - 我們的家庭空間（2025-11-02 更新，安全初始化）

-- 創建用戶表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
);

-- 檢查並添加 role 欄位
SET @role_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'role'
);
SET @sql = IF(@role_exists = 0,
  'ALTER TABLE users ADD COLUMN role ENUM("user", "admin") NOT NULL DEFAULT "user"',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 插入或更新預設管理員帳戶（密碼：admin123）
INSERT INTO users (username, email, password, role) VALUES (
  'admin',
  'admin@mysandshome.com',
  '$2b$10$80gmxoIc6.GiczCNng3fseLqhTn28hOmwjLlFfVDYqpIFhqDGocOW',
  'admin'
) ON DUPLICATE KEY UPDATE
  password = VALUES(password),
  role = VALUES(role);

-- 創建生字庫表
CREATE TABLE IF NOT EXISTS wordlists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_name (name)
);

-- 創建生字表
CREATE TABLE IF NOT EXISTS words (
  id INT AUTO_INCREMENT PRIMARY KEY,
  wordlist_id INT NOT NULL,
  english VARCHAR(255) NOT NULL,
  chinese VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wordlist_id) REFERENCES wordlists(id) ON DELETE CASCADE,
  INDEX idx_wordlist (wordlist_id),
  INDEX idx_english (english)
);

-- 創建任務表
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notified BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_due (user_id, due_date),
  INDEX idx_notified (notified)
);

-- 創建檔案表
CREATE TABLE IF NOT EXISTS files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL UNIQUE,
  original_name VARCHAR(255) NOT NULL,
  custom_name VARCHAR(255) NOT NULL DEFAULT '',
  description TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_filename (filename),
  INDEX idx_custom_name (custom_name)
);

-- 創建推送訂閱表
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subscription JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
);

-- 創建站點設定表
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(255) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (setting_key)
);

-- 初始化站點設定（我們的家庭空間 - 正式版）
INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_title', '我們的家庭空間'),
('vapid_public_key', 'BCUBSpo6Y0Q8QUKduPAWXSwcvlElJbg5_PZDiXYJf1JC8sS3lCODMs_IiFDahD0LtlimMBqZj1G7lH61eVJMGeY'),
('index_meta_description', '一個專為家庭成員打造的溫馨平台，讓我們一起管理任務、學習生字、分享美好時刻！'),
('index_meta_keywords', '家庭, 生字學習, 任務管理, 檔案分享, 筆記, PWA'),
('index_og_title', '我們的家庭空間'),
('index_og_description', '一個專為家庭成員打造的溫馨平台，讓我們一起管理任務、學習生字、分享美好時刻！'),
('login_meta_description', '登入我們的家庭空間，開始管理任務與學習'),
('login_meta_keywords', '家庭, 登入, 任務管理, 學習'),
('login_og_title', '我們的家庭空間 - 登入'),
('login_og_description', '登入家庭平台，管理任務、學習與分享'),
('register_meta_description', '註冊我們的家庭空間，立即開始使用'),
('register_meta_keywords', '家庭, 註冊, 學習管理'),
('register_og_title', '我們的家庭空間 - 註冊'),
('register_og_description', '立即註冊，體驗家庭專屬的管理與學習工具')
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  updated_at = CURRENT_TIMESTAMP;

-- 創建活動日誌表（包含 IP 和 User Agent）
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45) DEFAULT 'unknown',
  user_agent TEXT DEFAULT 'unknown',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_created (created_at),
  INDEX idx_ip (ip_address)
);

-- 創建家庭筆記表（Notebook）
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  color VARCHAR(7) DEFAULT '#FFFFFF',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_title (title),
  INDEX idx_updated (updated_at),
  INDEX idx_pinned (is_pinned)
);

-- 新增：筆記標籤表
CREATE TABLE IF NOT EXISTS note_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- 新增：筆記與標籤關聯表
CREATE TABLE IF NOT EXISTS note_tag_relations (
  note_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (note_id, tag_id),
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES note_tags(id) ON DELETE CASCADE
);

-- 新增：共享筆記連結表
CREATE TABLE IF NOT EXISTS shared_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  note_id INT NOT NULL,
  share_token CHAR(32) NOT NULL UNIQUE,
  expires_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  INDEX idx_token (share_token),
  INDEX idx_expires (expires_at)
);

-- 初始化常用標籤
INSERT IGNORE INTO note_tags (name, color) VALUES
('購物', '#EF4444'),
('食譜', '#10B981'),
('待辦', '#F59E0B'),
('會議', '#8B5CF6'),
('家庭', '#EC4899'),
('學習', '#06B6D4'),
('旅行', '#6366F1'),
('健康', '#14B8A6');

-- 檢查並添加 notes.is_pinned 和 color
SET @pinned_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'notes' AND COLUMN_NAME = 'is_pinned'
);
SET @color_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'notes' AND COLUMN_NAME = 'color'
);

SET @sql = IF(@pinned_exists = 0,
  'ALTER TABLE notes ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(@color_exists = 0,
  'ALTER TABLE notes ADD COLUMN color VARCHAR(7) DEFAULT "#FFFFFF"',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 檢查並添加 tasks.notified
SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'tasks' AND COLUMN_NAME = 'notified'
);
SET @sql = IF(@column_exists = 0,
  'ALTER TABLE tasks ADD COLUMN notified BOOLEAN DEFAULT FALSE',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 初始化過期任務的 notified 狀態
UPDATE tasks 
SET notified = TRUE 
WHERE due_date < NOW() AND (notified IS NULL OR notified = FALSE);

-- 檢查並添加 files.custom_name 和 description
SET @custom_name_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'files' AND COLUMN_NAME = 'custom_name'
);
SET @description_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'files' AND COLUMN_NAME = 'description'
);

SET @sql = IF(@custom_name_exists = 0,
  'ALTER TABLE files ADD COLUMN custom_name VARCHAR(255) NOT NULL DEFAULT ""',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(@description_exists = 0,
  'ALTER TABLE files ADD COLUMN description TEXT',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 為現有檔案設置預設 custom_name
UPDATE files 
SET custom_name = original_name 
WHERE custom_name IS NULL OR custom_name = '' OR custom_name = 'undefined';

-- 檢查並添加 activity_logs.ip_address 和 user_agent
SET @ip_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'activity_logs' AND COLUMN_NAME = 'ip_address'
);
SET @ua_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'activity_logs' AND COLUMN_NAME = 'user_agent'
);

SET @sql = IF(@ip_exists = 0,
  'ALTER TABLE activity_logs ADD COLUMN ip_address VARCHAR(45) DEFAULT "unknown"',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF(@ua_exists = 0,
  'ALTER TABLE activity_logs ADD COLUMN user_agent TEXT DEFAULT "unknown"',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ===================================================================
-- 安全新增 users.reset_token, reset_expires, idx_reset_token（重點防呆）
-- ===================================================================
SET @token_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'reset_token'
);
SET @expires_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'reset_expires'
);
SET @index_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users' 
    AND INDEX_NAME = 'idx_reset_token'
);

-- 只有在「兩個欄位都還沒加」且「索引也沒加」時才執行
SET @sql = IF(@token_exists = 0 AND @expires_exists = 0 AND @index_exists = 0,
  'ALTER TABLE users 
     ADD COLUMN reset_token VARCHAR(64) NULL,
     ADD COLUMN reset_expires DATETIME NULL,
     ADD INDEX idx_reset_token (reset_token)',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ===================================================================
-- 結束：所有操作皆為「可重複執行」
-- ===================================================================
```

## package.json

```json
{
  "name": "tools_app-webapp",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/thisismak/tools_app-WebApp.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/thisismak/tools_app-WebApp/issues"
  },
  "homepage": "https://github.com/thisismak/tools_app-WebApp#readme",
  "dependencies": {
    "bcrypt": "^6.0.0",
    "bcryptjs": "^3.0.2",
    "body-parser": "^2.2.0",
    "bootstrap": "^5.3.8",
    "cookie-parser": "^1.4.7",
    "dotenv": "^17.2.3",
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "marked": "^16.4.1",
    "moment": "^2.30.1",
    "moment-timezone": "^0.6.0",
    "multer": "^2.0.2",
    "mysql2": "^3.15.3",
    "nodemailer": "^7.0.10",
    "web-push": "^3.6.7"
  }
}
```

## README.md

```md
# Server安裝 (Rocky Linux 9)
## 更新系統
sudo dnf update -y
## 安裝EPEL及
sudo dnf install -y epel-release
sudo dnf module install nodejs:22
## 安裝 Git
sudo dnf install -y git
## 安裝 MariaDB
sudo dnf install -y mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb
sudo mysql_secure_installation
## Email Server安裝
a. 安裝 postfix、cyrus-sasl-plain、s-nail
sudo dnf install -y postfix cyrus-sasl-plain s-nail
b. 啟用並啟動 Postfix
sudo systemctl enable postfix
sudo systemctl start postfix
sudo systemctl status postfix --no-pager
c. 創建 SASL 密碼檔案
cat /etc/postfix/sasl_passwd
```
[smtp.gmail.com]:465 testing.email111011@gmail.com:lgzrupgilrymwjpu
```
d. 生成 hash 資料庫並設定權限
sudo postmap /etc/postfix/sasl_passwd
sudo chown root:root /etc/postfix/sasl_passwd /etc/postfix/sasl_passwd.db
sudo chmod 600 /etc/postfix/sasl_passwd /etc/postfix/sasl_passwd.db
e. 編輯 Postfix 設定檔
cat /etc/postfix/main.cf
```
# === 基本設定 ===
myhostname = localhost.localdomain
mydomain = localdomain
myorigin = $mydomain
inet_interfaces = all
inet_protocols = ipv4

# === 允許本機發信 ===
mynetworks = 127.0.0.0/8 [::1]/128

# === Gmail 中繼設定 ===
relayhost = [smtp.gmail.com]:465

# === SASL 認證 ===
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous

# === SSL/TLS (端口 465) ===
smtp_use_tls = yes
smtp_tls_security_level = encrypt
smtp_tls_wrappermode = yes
smtp_tls_CAfile = /etc/pki/tls/certs/ca-bundle.crt

# === 必須新增這三行！解決 smtpd fatal 錯誤 ===
smtpd_relay_restrictions = permit_mynetworks permit_sasl_authenticated reject_unauth_destination
smtpd_recipient_restrictions = permit_mynetworks permit_sasl_authenticated reject_unauth_destination
smtpd_sender_restrictions = permit_mynetworks permit_sasl_authenticated
```
f. 重啟 Postfix 並測試
sudo systemctl restart postfix
g. 測試郵件
echo "這是一封測試郵件，用於驗證 Postfix + Gmail SMTP。" | mail -s "Postfix Test" thismywing@hotmail.com
## 建立專案目錄
sudo mkdir -p /opt/family-app
cd /opt/family-app
## 從 GitHub 克隆程式碼
git clone https://github.com/thisismak/tools_app-WebApp_v2.git .
如果是私有儲存庫，新增認證：git clone https://username:token@github.com/...（使用 Personal Access Token）。
## 登入 MariaDB 並建立資料庫/使用者
sudo mysql -u root -p
## 在 MariaDB 提示符執行
CREATE DATABASE internal_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'sam1_sql_password';
GRANT ALL PRIVILEGES ON internal_website.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
## 安裝 Node.js 依賴
npm install
## 如果出現 bcrypt 編譯錯誤（常見於 Linux），安裝 build 工具
sudo dnf install -y gcc-c++ make
npm install bcryptjs --save
## 安裝pip3, 然後再安裝bcrypt
yum install python3-pip -y
pip3 install bcrypt
## 安裝 moment-timezone 套件，用於在 Node.js 和前端處理時區相關的日期和時間。
npm install -y moment-timezone
npm install express mysql2 bcryptjs jsonwebtoken body-parser cookie-parser moment moment-timezone web-push dotenv ejs
## 全域安裝 PM2
sudo npm install -g pm2
## 啟動應用程式
pm2 start app.js --name "family-app"
pm2 save
pm2 startup
## 安裝 Nginx
sudo dnf install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
## 編輯 
vi /etc/nginx/conf.d/family-app.conf
按目錄內family-app.conf設置

## 安裝SSL (Let’s encrypt)
a. 安裝 Certbot 和 Nginx 插件
sudo dnf install certbot python3-certbot-nginx -y

b. 驗證 Certbot 安裝
certbot --version

c. 申請 Let's Encrypt SSL 證書
sudo certbot --nginx -d www.mysandshome.com

d. 檢查Nginx是否已自動導入SSL內容
cat /etc/nginx/conf.d/family-app.conf

e. 檢查配置
sudo nginx -t

f. 如果沒有錯誤，重啟 Nginx 應用更改
sudo systemctl restart nginx

g. 設置自動續期
sudo certbot renew --dry-run

h. 可以手動添加 Cron 任務
sudo crontab -e
0 0,12 * * * certbot renew --quiet

## nginx.conf加入PWA功能
vi /etc/nginx/conf.d/family-app.conf
按目錄內family-app.conf設置

## 添加手機推送通知功能
a. 安裝 web-push 模組
cd /opt/tools_app-webapp
npm install web-push --save
b. Install web-push Globally
npm install -g web-push
c. 導出高安全性的VAPID Keys
web-push generate-vapid-keys
Public Key:
BCUBSpo6Y0Q8QUKduPAWXSwcvlElJbg5_PZDiXYJf1JC8sS3lCODMs_IiFDahD0LtlimMBqZj1G7lH61eVJMGeY
Private Key:
bwXEQHcZYH2FUQ2_NKtAxorzjh-l8Dkrrro79bpjRn4
d. 修改.env文件內容
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=sam1_sql_password
DB_NAME=internal_website
JWT_SECRET=your_jwt_secret_key
PORT=3000
VAPID_PUBLIC_KEY=BCUBSpo6Y0Q8QUKduPAWXSwcvlElJbg5_PZDiXYJf1JC8sS3lCODMs_IiFDahD0LtlimMBqZj1G7lH61eVJMGeY
VAPID_PRIVATE_KEY=bwXEQHcZYH2FUQ2_NKtAxorzjh-l8Dkrrro79bpjRn4
```
## 測試並重載
sudo nginx -t
sudo systemctl reload nginx
## 打開網站測試
http://www.mysandshome.com/login

# 系統安全設置
## firewalld設置
- 啟用並運行 firewalld
systemctl enable --now firewalld
- 開放 HTTP 和 HTTPS 服務
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
- 開放自定義 SSH 端口
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" port port="33888" protocol="tcp" accept'
- 限制 MySQL 端口 (3306)
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="127.0.0.1" port port="3306" protocol="tcp" accept'
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" port port="3306" protocol="tcp" reject'
- 應用防火牆規則
firewall-cmd --reload
- 檢查防火牆配置
firewall-cmd --list-all
## fail2ban(ssh/http)設置
- 安裝 Fail2Ban
dnf install -y fail2ban
- 啟動 Fail2Ban 服務
systemctl start fail2ban
- 設置 Fail2Ban 開機自動啟動
systemctl enable fail2ban
- 創建 Fail2Ban 自定義配置目錄
mkdir -p /etc/fail2ban/jail.d
- 配置 SSH 防護
vi /etc/fail2ban/jail.d/sshd.local
```
[sshd]
enabled = true
port = 33888
maxretry = 3
bantime = 3600
findtime = 600
logpath = /var/log/secure
backend = auto
```
- 檢查ssh記錄是否存在
ls /var/log/secure
- 配置 Nginx HTTP 認證防護
vi /etc/fail2ban/jail.d/nginx-http-auth.local
```
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 5
bantime = 3600
findtime = 600
backend = auto
```
- 重啟 Fail2Ban 服務
systemctl restart fail2ban
## Netdata設置
- 使用 dnf 安裝 wget
sudo dnf install -y wget
- 下載並執行最新腳本
DISABLE_TELEMETRY=1 wget -O /tmp/netdata-kickstart.sh https://get.netdata.cloud/kickstart.sh && sh /tmp/netdata-kickstart.sh --release-channel stable
- 確認服務狀態
sudo systemctl status netdata
- 啟動並設置開機啟動
sudo systemctl start netdata
sudo systemctl enable netdata
- 添加防火牆規則
sudo firewall-cmd --permanent --add-port=19999/tcp
sudo firewall-cmd --reload
- 檢查防火牆
sudo firewall-cmd --list-all
- 關閉SElinux
setenforce 0 && getenforce && sed "s#SELINUX=enforcing#SELINUX=disabled#g" /etc/selinux/config -i 
- 配置 Fail2Ban 保護 Netdata
sudo vi /etc/fail2ban/jail.d/netdata.local
```
[netdata]
enabled = true
port = 19999
logpath = /var/log/netdata/access.log
maxretry = 5
bantime = 3600
findtime = 600
backend = auto
```
- 重啟 Fail2Ban
sudo systemctl restart fail2ban
- 能打開監控頁面
IP:19999
## 資源監控腳本
- 安裝 sysstat（提供 iostat）和 bc
sudo dnf install -y sysstat bc
- 啟動 sysstat 服務（確保 iostat 數據可用）
sudo systemctl enable --now sysstat
- 將腳本保存到 /var/process
sudo vi /var/process
```
#!/bin/bash

# 腳本使用 bc 進行浮點數比較。需安裝
# apt install bc -y
# 用於監控 IO 使用率，屬於 sysstat 包。需安裝
# apt install sysstat -y

# TG 机器人 token
TOKEN="5203692206:AAFG0RMH8VubUXQvIHrYm0CKM2uT8DlhSeQ"
# 用户 ID 或频道、群 ID
chat_ID="-4941586070"
# API 接口
URL="https://api.telegram.org/bot${TOKEN}/sendMessage"
# 解析模式
MODE="HTML"

# 收集服務器資訊
HOSTNAME=$(hostname)
IP=$(ip addr show | grep -w inet | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)  # 獲取內網或外網 IP

# 阈值（可根据需求调整）
CPU_THRESHOLD=50
MEM_THRESHOLD=80
DISK_THRESHOLD=90
IO_THRESHOLD=50

# 監控超過阈值的計數器
CPU_EXCEED_COUNT=0
MEM_EXCEED_COUNT=0
DISK_EXCEED_COUNT=0
IO_EXCEED_COUNT=0
CHECK_INTERVAL=60  # 每60秒檢查一次

while true; do
    # 收集當前系統資訊
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    CPU_USAGE=$(top -bn1 | grep '%Cpu(s)' | awk '{printf "%.2f", $2}')
    MEM_USAGE=$(free -m | awk '/Mem:/ {print $3/$2 * 100.0}')
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    IO_USAGE=$(iostat -dx | grep sda | awk '{print $NF}')
    TOP_PROCESSES=$(ps -eo pid,ppid,%cpu,%mem,cmd --sort=-%cpu,-%mem | head -n 6 | awk 'NR>1 {printf "%s (PID: %s, CPU: %s%%, MEM: %s%%)\n", $5, $1, $3, $4}')

    # 檢查各項指標是否超過閾值
    ALERT_MESSAGE=""
    
    # CPU 檢查
    if (( $(echo "$CPU_USAGE > $CPU_THRESHOLD" | bc -l) )); then
        ((CPU_EXCEED_COUNT++))
        if [ $CPU_EXCEED_COUNT -ge 5 ]; then
            ALERT_MESSAGE="${ALERT_MESSAGE}<b>CPU 使用率異常</b>: ${CPU_USAGE}% (超過 ${CPU_THRESHOLD}% 持續5分鐘)\n"
        fi
    else
        CPU_EXCEED_COUNT=0
    fi

    # 記憶體檢查
    if (( $(echo "$MEM_USAGE > $MEM_THRESHOLD" | bc -l) )); then
        ((MEM_EXCEED_COUNT++))
        if [ $MEM_EXCEED_COUNT -ge 5 ]; then
            ALERT_MESSAGE="${ALERT_MESSAGE}<b>記憶體使用異常</b>: ${MEM_USAGE}% (超過 ${MEM_THRESHOLD}% 持續5分鐘)\n"
        fi
    else
        MEM_EXCEED_COUNT=0
    fi

    # 磁碟檢查
    if (( $(echo "$DISK_USAGE > $DISK_THRESHOLD" | bc -l) )); then
        ((DISK_EXCEED_COUNT++))
        if [ $DISK_EXCEED_COUNT -ge 5 ]; then
            ALERT_MESSAGE="${ALERT_MESSAGE}<b>磁碟使用異常</b>: ${DISK_USAGE}% (超過 ${DISK_THRESHOLD}% 持續5分鐘)\n"
        fi
    else
        DISK_EXCEED_COUNT=0
    fi

    # IO 檢查
    if (( $(echo "$IO_USAGE > $IO_THRESHOLD" | bc -l) )); then
        ((IO_EXCEED_COUNT++))
        if [ $IO_EXCEED_COUNT -ge 5 ]; then
            ALERT_MESSAGE="${ALERT_MESSAGE}<b>IO 使用異常</b>: ${IO_USAGE}% (超過 ${IO_THRESHOLD}% 持續5分鐘)\n"
        fi
    else
        IO_EXCEED_COUNT=0
    fi

    # 如果有任何異常，發送通知
    if [ -n "$ALERT_MESSAGE" ]; then
        message_text="
        <b>服務器監控通知</b>
        <b>主機名</b>: ${HOSTNAME}
        <b>IP</b>: ${IP}
        <b>時間</b>: ${TIMESTAMP}
        ${ALERT_MESSAGE}
        <b>當前系統狀態</b>:
        CPU 使用率: ${CPU_USAGE}%
        記憶體使用: ${MEM_USAGE}%
        磁碟使用: ${DISK_USAGE}%
        IO使用: ${IO_USAGE}%
        <b>佔用最高的5個程序</b>:
        ${TOP_PROCESSES}
        "

        # 發送 Telegram 通知
        curl -s -X POST "$URL" -d chat_id="${chat_ID}" -d parse_mode="${MODE}" -d text="${message_text}"

        # 重置所有計數器
        CPU_EXCEED_COUNT=0
        MEM_EXCEED_COUNT=0
        DISK_EXCEED_COUNT=0
        IO_EXCEED_COUNT=0
    fi

    sleep $CHECK_INTERVAL
done
```
- 設置執行權限：
sudo chmod +x /var/process
- 創建 systemd 服務文件
sudo vi /etc/systemd/system/process-monitor.service
```
[Unit]
Description=System Monitor with Telegram Notifications
After=network.target sysstat.service

[Service]
ExecStart=/var/process
Restart=always
User=root
WorkingDirectory=/var
StandardOutput=append:/var/log/process-monitor.log
StandardError=append:/var/log/process-monitor.log

[Install]
WantedBy=multi-user.target
```
- 啟用並啟動服務
sudo systemctl daemon-reload
sudo systemctl enable process-monitor.service
sudo systemctl start process-monitor.service
- [可選擇]壓力測試了解腳本運作
stress-ng --vm 100 --vm-bytes 100% --timeout 600s --metrics-brief


# 故障處理需知
## 重啟網站服務方法
sudo truncate -s 0 /var/log/nginx/access.log
sudo truncate -s 0 /var/log/nginx/error.log
pm2 flush tools_app-webapp

pm2 restart tools_app-webapp
systemctl restart nginx

## 常用日誌
tail -n 50 /var/log/nginx/access.log
tail -n 50 /var/log/nginx/error.log
pm2 log tools_app-webapp

## 檢查SQL內容
mysql -u app_user -psam1_sql_password -e "SHOW DATABASES;"
mysql -u app_user -psam1_sql_password -e "SHOW TABLES FROM internal_website;"
mysql -u app_user -psam1_sql_password -e "USE internal_website; SHOW CREATE TABLE users;"
mysql -u app_user -psam1_sql_password -e "USE internal_website; DESC users;"
mysql -u app_user -psam1_sql_password -e "USE internal_website; SELECT * FROM users;"

## 導出所有網站內容
- Exports the entire directory to the output file.
Dir2file: Export Directory to File
- Opens a QuickPick menu to select specific files for export.
Dir2file: Select Files to Export
PS: 先安裝Export Directory to File

## 刪除不必要的備份檔
find /opt/tools_app-webapp -type f -name "*.bak" -delete
```

