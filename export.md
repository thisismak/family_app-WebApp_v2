# Project Structure

```
public/
  css/
    style.css
  images/
  js/
    taskmanager.js
  manifest.json
  offline.html
  robots.txt
  sitemap.xml
  sw.js
services/
  fileService.js
  subscriptionService.js
  taskService.js
  userService.js
  wordlistService.js
  wordService.js
views/
  partials/
    pwa.ejs
  dashboard.ejs
  dictation.ejs
  filemanager.ejs
  index.ejs
  login.ejs
  register.ejs
  sitemap.ejs
  taskmanager.ejs
.env
.gitignore
app.js
db.js
init.sql
package.json
```


## public\css\style.css

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
body {
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  color: #fff;
  min-height: 100vh;
}
.container {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}
.btn-primary {
  background: #00bfff;
  border: none;
}
.btn-primary:hover, .btn-secondary:hover {
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
  transition: all 0.3s ease;
}
.btn-secondary {
  background: #4b5e8e;
  border: none;
}
.text-info {
  color: #00bfff !important;
}
.alert-danger {
  background: rgba(255, 99, 71, 0.2);
  border: 1px solid #ff6347;
  color: #fff;
}
@media (max-width: 768px) {
  .container { padding: 15px; }
}

.card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.table-dark {
  background: rgba(255, 255, 255, 0.05);
}
.modal-content.bg-dark {
  background: #1a1a2e !important;
}
```


## public\js\taskmanager.js

```js
let tasks = [];
const notifiedTasks = new Set();

function urlBase64ToUint8Array(base64String) {
  try {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  } catch (err) {
    console.error('VAPID 公鑰轉換失敗:', err);
    throw new Error('無效的 VAPID 公鑰');
  }
}

function checkNotificationPermission() {
  console.log('檢查通知權限，當前狀態:', Notification.permission);
  if (Notification.permission === 'granted') {
    console.log('通知權限已授予，開始訂閱推送');
    subscribeToPush();
  } else if (Notification.permission !== 'denied') {
    console.log('請求通知權限');
    alert('請啟用通知以接收任務到期提醒！');
    Notification.requestPermission().then(permission => {
      console.log('通知權限請求結果:', permission);
      if (permission === 'granted') {
        subscribeToPush();
      } else {
        console.warn('用戶拒絕通知權限:', permission);
        alert('您已拒絕通知權限，無法接收任務提醒。請在瀏覽器設置中啟用通知。');
      }
    }).catch(err => {
      console.error('通知權限請求錯誤:', err);
      alert('請求通知權限失敗，請重試或檢查瀏覽器設置。');
    });
  } else {
    console.warn('通知權限已被拒絕:', Notification.permission);
    alert('通知權限已被拒絕，請在瀏覽器設置中啟用以接收任務提醒。');
  }
}

function subscribeToPush() {
  console.log('開始訂閱推送通知流程');
  if (!('serviceWorker' in navigator && 'PushManager' in window)) {
    console.warn('瀏覽器不支援推送通知或 Service Worker');
    alert('您的瀏覽器不支援推送通知，無法接收任務提醒。');
    return;
  }
  navigator.serviceWorker.ready.then(registration => {
    console.log('Service Worker 準備就緒，註冊狀態:', registration.active?.state);
    registration.pushManager.getSubscription().then(existingSubscription => {
      if (existingSubscription) {
        console.log('發現現有推送訂閱:', existingSubscription.endpoint);
        saveSubscriptionToServer(existingSubscription);
        return;
      }
      console.log('無現有訂閱，創建新訂閱');
      const vapidKey = document.querySelector('script[data-vapid-key]')?.dataset.vapidKey;
      console.log('使用 VAPID 公鑰:', vapidKey ? vapidKey.substring(0, 20) + '...' : '未找到 VAPID 公鑰');
      console.log('嘗試訂閱推送，VAPID 公鑰是否有效:', !!vapidKey);
      if (!vapidKey) {
        console.error('VAPID 公鑰未正確載入');
        alert('推送功能初始化失敗，請重新載入頁面');
        return;
      }
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      }).then(subscription => {
        console.log('新推送訂閱創建成功:', subscription.endpoint);
        saveSubscriptionToServer(subscription);
      }).catch(err => {
        console.error('創建推送訂閱失敗:', err);
        alert('創建推送訂閱失敗: ' + err.message);
      });
    }).catch(err => {
      console.error('獲取現有訂閱失敗:', err);
      alert('獲取推送訂閱失敗，請重試或檢查瀏覽器設置。');
    });
  }).catch(err => {
    console.error('Service Worker 未準備就緒:', err);
    alert('Service Worker 初始化失敗，請重新載入頁面');
  });
}

function saveSubscriptionToServer(subscription) {
  console.log('儲存訂閱到伺服器:', subscription?.endpoint);
  console.log('發送訂閱請求，包含 Cookie:', document.cookie);
  fetch('/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': document.cookie },
    body: JSON.stringify(subscription)
  }).then(response => {
    console.log('訂閱儲存請求響應狀態:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }).then(data => {
    console.log('訂閱儲存響應數據:', data);
    if (data.success) {
      console.log('推送訂閱儲存成功');
      alert('推送通知訂閱成功！您將收到任務到期提醒。');
    } else {
      console.error('推送訂閱儲存失敗:', data.error);
      alert('推送訂閱儲存失敗: ' + (data.error || '未知錯誤'));
    }
  }).catch(err => {
    console.error('推送訂閱儲存錯誤:', err);
    alert('推送訂閱儲存失敗: ' + err.message + '\n請檢查網路連線或重新載入頁面。');
  });
}

function formatDateTime(date, time) {
  if (!date || !time) {
    throw new Error('日期和時間不能為空');
  }
  try {
    const dateTime = moment.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', 'Asia/Hong_Kong');
    if (!dateTime.isValid()) {
      throw new Error('無效的日期時間格式');
    }
    if (dateTime.isBefore(moment())) {
      throw new Error('到期時間必須是未來時間');
    }
    const formatted = dateTime.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    console.log('格式化日期時間:', {
      input: `${date} ${time}`,
      output: formatted,
      timezone: dateTime.tz()
    });
    return formatted;
  } catch (err) {
    console.error('日期格式化錯誤:', err);
    throw new Error('日期時間格式化失敗: ' + err.message);
  }
}

function formatDisplayDateTime(datetime) {
  if (typeof moment === 'undefined') {
    console.error('Moment.js 未載入');
    throw new Error('日期處理庫未載入');
  }
  const formatted = moment(datetime).tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm');
  console.log(`格式化顯示時間: ${datetime} -> ${formatted}`);
  return formatted;
}

function loadTasks() {
  fetch('/taskmanager/tasks')
    .then(response => response.json())
    .then(data => {
      tasks = Array.isArray(data) ? data : [];
      displayTaskList();
      renderCalendar();
    })
    .catch(() => {
      tasks = [];
      displayTaskList();
      renderCalendar();
    });
}

function displayTaskList() {
  const taskList = document.getElementById('taskList');
  if (!taskList) {
    console.error('任務列表元素未找到');
    return;
  }
  taskList.innerHTML = '';
  if (!Array.isArray(tasks) || tasks.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item text-center';
    li.textContent = '暫無任務';
    taskList.appendChild(li);
    return;
  }
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
           <div>
             <strong>${escapeHtml(String(task.title || ''))}</strong> - ${escapeHtml(String(task.description || '無描述'))} (到期: ${formatDisplayDateTime(task.due_date)})
           </div>
           <div>
             <button class="btn btn-sm btn-warning mx-1" onclick="editTask(${task.id})">編輯</button>
             <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">刪除</button>
           </div>
         `;
    taskList.appendChild(li);
  });
}

function renderCalendar(attempt = 1) {
  if (typeof FullCalendar === 'undefined') {
    console.error(`FullCalendar 未載入，嘗試次數: ${attempt}`);
    if (attempt < 3) {
      console.log(`重試 renderCalendar，次數: ${attempt + 1}`);
      setTimeout(() => renderCalendar(attempt + 1), 2000);
      return;
    }
    alert('日曆功能載入失敗，請重新載入頁面');
    return;
  }
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) {
    console.error('日曆元素未找到');
    return;
  }
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    timeZone: 'Asia/Hong_Kong',
    events: Array.isArray(tasks) ? tasks.map(task => ({
      title: task.title,
      start: moment(task.due_date).tz('Asia/Hong_Kong').format('YYYY-MM-DDTHH:mm:ssZ'),
      allDay: false,
      backgroundColor: '#FFFF00',
      borderColor: '#FFFF00',
      textColor: '#000000'
    })) : [],
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  });
  calendar.render();
}

function saveTask() {
  const id = document.getElementById('taskId')?.value;
  const title = document.getElementById('title')?.value.trim();
  const description = document.getElementById('description')?.value.trim();
  const dueDate = document.getElementById('dueDate')?.value;
  const dueTime = document.getElementById('dueTime')?.value;

  if (!title || !dueDate || !dueTime) {
    alert('請填寫標題、到期日期和到期時間！');
    return;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate) || !/^\d{2}:\d{2}$/.test(dueTime)) {
    alert('請輸入有效的日期（YYYY-MM-DD）和時間（HH:mm）格式！');
    return;
  }

  try {
    const dueDateTime = moment.tz(`${dueDate} ${dueTime}`, 'YYYY-MM-DD HH:mm', 'Asia/Hong_Kong')
      .format('YYYY-MM-DDTHH:mm:ss.SSSZ');

    const payload = {
      title,
      description: description || '',
      due_date: dueDateTime
    };

    console.log('儲存任務請求數據:', payload);

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/taskmanager/edit/${id}` : '/taskmanager/add';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': document.cookie // 確保帶上 JWT
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
      .then(response => {
        console.log('儲存任務響應狀態:', response.status, response.statusText);
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(`HTTP ${response.status}: ${data.error || response.statusText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('儲存任務響應數據:', data);
        if (!data || typeof data !== 'object') {
          throw new Error('無效的響應數據');
        }
        if (!data.success) {
          throw new Error(data.error || '儲存失敗');
        }
        loadTasks();
        resetForm();
        alert('任務已儲存！');
      })
      .catch(err => {
        console.error('儲存任務錯誤:', err.message, err.stack);
        alert('儲存任務失敗: ' + err.message);
      });
  } catch (err) {
    console.error('請求準備失敗:', err.message, err.stack);
    alert('請求準備失敗: ' + err.message);
  }
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) {
    console.warn('未找到任務:', id);
    alert('無法編輯任務，任務不存在');
    return;
  }
  const taskIdEl = document.getElementById('taskId');
  const titleEl = document.getElementById('title');
  const descriptionEl = document.getElementById('description');
  const dueDateEl = document.getElementById('dueDate');
  const dueTimeEl = document.getElementById('dueTime');
  if (!taskIdEl || !titleEl || !descriptionEl || !dueDateEl || !dueTimeEl) {
    console.error('表單元素未找到');
    alert('編輯表單載入失敗，請重新載入');
    return;
  }
  taskIdEl.value = task.id;
  titleEl.value = task.title;
  descriptionEl.value = task.description || '';
  const dueDateTime = moment(task.due_date).tz('Asia/Hong_Kong');
  dueDateEl.value = dueDateTime.format('YYYY-MM-DD');
  dueTimeEl.value = dueDateTime.format('HH:mm');
}

function deleteTask(id) {
  if (!confirm('確定要刪除此任務嗎？')) {
    console.log('用戶取消刪除任務:', id);
    return;
  }
  fetch(`/taskmanager/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Cookie': document.cookie }
  })
    .then(response => {
      console.log('刪除任務響應狀態:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('刪除任務響應數據:', data);
      if (data.success) {
        console.log('任務刪除成功:', id);
        loadTasks();
      } else {
        console.error('任務刪除失敗:', data.error);
        alert(data.error || '刪除任務失敗');
      }
    })
    .catch(err => {
      console.error('刪除任務錯誤:', err);
      alert('刪除任務失敗: ' + err.message);
    });
}

function resetForm() {
  const form = document.getElementById('taskForm');
  const taskIdEl = document.getElementById('taskId');
  if (!form || !taskIdEl) {
    console.error('表單或任務ID元素未找到');
    return;
  }
  form.reset();
  taskIdEl.value = '';
}

function checkUpcomingTasks() {
  if (typeof moment === 'undefined') {
    console.error('Moment.js 未載入，無法檢查即將到期任務');
    return;
  }
  if (!Array.isArray(tasks)) {
    console.warn('任務列表無效，跳過即將到期檢查');
    return;
  }
  const now = moment().tz('Asia/Hong_Kong');
  tasks.forEach(task => {
    if (!task.due_date || !moment(task.due_date).isValid()) {
      console.warn('任務到期日期無效:', task.id, task.title, task.due_date);
      return;
    }
    const dueDateTime = moment(task.due_date).tz('Asia/Hong_Kong');
    const diffMinutes = dueDateTime.diff(now, 'minutes');
    if (diffMinutes > 0 && diffMinutes <= 5 && !notifiedTasks.has(task.id)) {
      console.log('即將到期任務:', task.title, '剩餘分鐘:', diffMinutes);
      alert(`任務 "${task.title}" 將於 ${dueDateTime.format('YYYY-MM-DD HH:mm')} 到期！`);
      notifiedTasks.add(task.id);
    }
  });
}

// 小工具：簡單轉義避免內嵌 HTML 注入
function escapeHtml(str) {
  return str.replace(/[&<>"'`=\/]/g, function (s) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    })[s];
  });
}

// 掛到全域，確保在 EJS 中可以檢查與呼叫
window.loadTasks = loadTasks;
window.checkNotificationPermission = checkNotificationPermission;
window.checkUpcomingTasks = checkUpcomingTasks;
window.saveTask = saveTask;
window.editTask = editTask;
window.deleteTask = deleteTask;
window.resetForm = resetForm;

// 在這裡綁定 DOMContentLoaded 事件，確保頁面元素已載入
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded 事件觸發，FullCalendar 狀態:', typeof FullCalendar);
  console.log('初始化時檢查通知權限');
  checkNotificationPermission();
  try {
    if (typeof loadTasks !== 'function') {
      console.warn('loadTasks 未定義，將略過載入。');
    } else {
      loadTasks();
    }
  } catch (err) {
    console.error('任務管理頁面初始化錯誤:', err);
  }
});
```


## public\manifest.json

```json
{
  "name": "技術人員內部網站",
  "short_name": "技術網站",
  "description": "一個專為技術人員設計的學習與管理平台",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0c29",
  "theme_color": "#00bfff",
  "icons": [
    {
      "src": "/images/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "lang": "zh-TW",
  "dir": "ltr"
}
```


## public\offline.html

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


## public\robots.txt

```txt
User-agent: *
Allow: /
Allow: /login
Allow: /register
Disallow: /dashboard
Disallow: /dictation
Disallow: /taskmanager
Disallow: /filemanager
Sitemap: https://tools.mysandshome.com/sitemap.xml
```


## public\sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tools.mysandshome.com/</loc>
    <lastmod>2025-10-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tools.mysandshome.com/login</loc>
    <lastmod>2025-10-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tools.mysandshome.com/register</loc>
    <lastmod>2025-10-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```


## public\sw.js

```js
const PRECACHE = 'precache-v4';
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
      .then(cache => {
        console.log('預快取資源:', PRECACHE_URLS);
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('預快取失敗:', err))
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker 啟動中');
  const currentCaches = [PRECACHE];
  event.waitUntil(
    caches.keys()
      .then(cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName)))
      .then(cachesToDelete => Promise.all(
        cachesToDelete.map(cacheToDelete => {
          console.log('刪除舊快取:', cacheToDelete);
          return caches.delete(cacheToDelete);
        })
      ))
      .then(() => self.clients.claim())
      .catch(err => console.error('啟動清理失敗:', err))
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) {
    console.log('跳過非 HTTP 請求:', url.href);
    return;
  }
  if (url.pathname.startsWith('/uploads/')) {
    console.log('動態檔案請求，使用 network-only:', url.pathname);
    event.respondWith(fetch(event.request));
    return;
  }
  if (PRECACHE_URLS.includes(url.pathname) || PRECACHE_URLS.includes(url.href)) {
    console.log('從快取提供靜態資源:', url.href);
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          console.log('從網絡獲取靜態資源:', url.href);
          return fetch(event.request);
        })
        .catch(err => {
          console.error('靜態資源快取失敗:', url.href, err);
          return caches.match('/offline.html')
            .then(offlineResponse => {
              if (offlineResponse) {
                console.log('提供離線頁面:', url.href);
                return offlineResponse;
              }
              throw new Error('無離線頁面可用');
            });
        })
    );
  } else {
    console.log('動態請求，使用 network-only:', url.pathname);
    event.respondWith(fetch(event.request));
  }
});

self.addEventListener('push', event => {
  console.log('收到推送通知:', event.data?.text() || '無數據');
  const data = event.data ? JSON.parse(event.data.text()) : { title: '通知', body: '您有新通知！', url: '/' };
  const options = {
    body: data.body,
    icon: data.icon || '/images/icon-192x192.png',
    badge: '/images/icon-192x192.png',
    data: { url: data.url }
  };
  event.waitUntil(
    self.registration.showNotification(data.title || '通知', options)
      .catch(err => console.error('顯示通知失敗:', err))
  );
});

self.addEventListener('notificationclick', event => {
  console.log('通知被點擊:', event.notification.title);
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        const url = event.notification.data.url || '/';
        console.log('導航到 URL:', url);
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
      .catch(err => console.error('處理通知點擊失敗:', err))
  );
});
```


## services\fileService.js

```js
const { query } = require('../db');
const fs = require('fs').promises;
const path = require('path');

const uploadDir = path.join(__dirname, '../public/uploads');

async function ensureUploadDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error('創建上傳目錄失敗:', err);
    throw new Error('無法創建上傳目錄');
  }
}

async function saveFile(userId, filename, originalName, customName, description) {
  try {
    await query(
      'INSERT INTO files (user_id, filename, original_name, custom_name, description) VALUES (?, ?, ?, ?, ?)',
      [userId, filename, originalName, customName, description]
    );
    console.log('檔案記錄儲存成功:', { userId, filename, customName });
  } catch (err) {
    console.error('儲存檔案記錄失敗:', err);
    throw new Error('儲存檔案記錄失敗');
  }
}

async function getFiles(userId) {
  try {
    const results = await query(
      'SELECT filename, original_name, custom_name, description, uploaded_at FROM files WHERE user_id = ?',
      [userId]
    );
    // 推斷 MIME 類型
    const files = results.map(file => ({
      ...file,
      mime_type: inferMimeType(file.original_name)
    }));
    console.log('查詢檔案結果:', { userId, files });
    return files || [];
  } catch (err) {
    console.error('查詢檔案失敗:', err);
    throw new Error('查詢檔案失敗');
  }
}

async function editFile(userId, filename, customName, description) {
  try {
    const result = await query(
      'UPDATE files SET custom_name = ?, description = ? WHERE user_id = ? AND filename = ?',
      [customName, description, userId, filename]
    );
    if (result.affectedRows === 0) {
      throw new Error('檔案不存在或無權限編輯');
    }
    console.log('檔案資訊更新成功:', { userId, filename, customName });
  } catch (err) {
    console.error('更新檔案資訊失敗:', err);
    throw new Error('更新檔案資訊失敗');
  }
}

async function deleteFile(userId, filename) {
  try {
    const filePath = path.join(uploadDir, filename);
    await fs.unlink(filePath);
    await query('DELETE FROM files WHERE user_id = ? AND filename = ?', [userId, filename]);
    console.log('檔案刪除成功:', { userId, filename });
  } catch (err) {
    console.error('刪除檔案失敗:', err);
    throw new Error('刪除檔案失敗');
  }
}

function inferMimeType(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.pdf':
      return 'application/pdf';
    case '.txt':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
}

module.exports = { ensureUploadDir, saveFile, getFiles, editFile, deleteFile };
```


## services\subscriptionService.js

```js
const { query } = require('../db');

async function saveSubscription(userId, subscription) {
  if (!subscription || !subscription.endpoint) {
    console.error('無效的訂閱物件:', { userId, subscription });
    throw new Error('無效的推送訂閱數據');
  }
  const existing = await query('SELECT * FROM push_subscriptions WHERE user_id = ? AND JSON_EXTRACT(subscription, "$.endpoint") = ?', [userId, subscription.endpoint]);
  if (!Array.isArray(existing)) {
    console.error('查詢結果無效:', { userId, existing });
    throw new Error('查詢訂閱記錄失敗');
  }
  if (existing.length > 0) {
    console.log('訂閱已存在，跳過保存:', userId, subscription.endpoint);
    return;
  }
  await query('INSERT INTO push_subscriptions (user_id, subscription) VALUES (?, ?)',
    [userId, JSON.stringify(subscription)]);
  console.log('推送訂閱新增成功:', userId, subscription.endpoint);
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


## services\taskService.js

```js
const { query } = require('../db');
const moment = require('moment-timezone');

async function getTasks(userId) {
  try {
    const results = await query('SELECT * FROM tasks WHERE user_id = ?', [userId]);
    console.log('查詢任務結果:', { userId, results });
    return results.map(task => ({
      ...task,
      due_date: moment(task.due_date).tz('Asia/Hong_Kong').format('YYYY-MM-DDTHH:mm:ssZ')
    })) || [];
  } catch (err) {
    console.error('查詢任務錯誤:', { userId, error: err.message, stack: err.stack });
    throw err;
  }
}

async function addTask(userId, title, description, dueDate) {
  if (!title || !dueDate) {
    throw new Error('請提供標題和到期日期');
  }
  if (!moment(dueDate, moment.ISO_8601, true).isValid()) {
    throw new Error('無效的到期日期格式');
  }
  if (moment(dueDate).isBefore(moment())) {
    throw new Error('到期日期必須是未來時間');
  }
  const formattedDueDate = moment.tz(dueDate, 'Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss');
  try {
    const result = await query(
      'INSERT INTO tasks (user_id, title, description, due_date, notified) VALUES (?, ?, ?, ?, FALSE)',
      [userId, title, description || '', formattedDueDate]
    );
    console.log('任務儲存成功:', result.insertId);
    return result.insertId;
  } catch (err) {
    console.error('addTask 錯誤:', { userId, title, description, dueDate: formattedDueDate, error: err.message, stack: err.stack });
    throw err;
  }
}

async function editTask(userId, taskId, title, description, dueDate) {
  if (!title || !dueDate) {
    throw new Error('請提供標題和到期日期');
  }
  if (!moment(dueDate, moment.ISO_8601, true).isValid()) {
    throw new Error('無效的到期日期格式');
  }
  if (moment(dueDate).isBefore(moment())) {
    throw new Error('到期日期必須是未來時間');
  }
  const formattedDueDate = moment.tz(dueDate, 'Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss');
  try {
    await query(
      'UPDATE tasks SET title = ?, description = ?, due_date = ?, notified = FALSE WHERE id = ? AND user_id = ?',
      [title, description || '', formattedDueDate, taskId, userId]
    );
    console.log('任務更新成功:', taskId);
  } catch (err) {
    console.error('editTask 錯誤:', { userId, taskId, title, description, dueDate: formattedDueDate, error: err.message, stack: err.stack });
    throw err;
  }
}

async function deleteTask(userId, taskId) {
  try {
    await query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
    console.log('任務刪除成功:', taskId);
  } catch (err) {
    console.error('deleteTask 錯誤:', { userId, taskId, error: err.message, stack: err.stack });
    throw err;
  }
}

async function checkUpcomingTasks() {
  const now = moment().tz('Asia/Hong_Kong');
  const thirtyDaysAgo = now.clone().subtract(30, 'days');
  const inOneMinute = now.clone().add(1, 'minutes');
  try {
    const results = await query(
      'SELECT t.*, ps.subscription FROM tasks t JOIN push_subscriptions ps ON t.user_id = ps.user_id WHERE t.due_date BETWEEN ? AND ? AND t.notified = FALSE',
      [thirtyDaysAgo.format('YYYY-MM-DD HH:mm:ss'), inOneMinute.format('YYYY-MM-DD HH:mm:ss')]
    );
    // 按任務分組，確保每個任務對應所有訂閱
    const tasksWithSubscriptions = [];
    const taskMap = new Map();
    results.forEach(row => {
      const taskId = row.id;
      if (!taskMap.has(taskId)) {
        taskMap.set(taskId, {
          ...row,
          subscriptions: []
        });
      }
      taskMap.get(taskId).subscriptions.push(JSON.parse(row.subscription));
    });
    return Array.from(taskMap.values());
  } catch (err) {
    console.error('checkUpcomingTasks 錯誤:', { error: err.message, stack: err.stack });
    throw err;
  }
}

async function markTaskAsNotified(taskId) {
  try {
    await query('UPDATE tasks SET notified = TRUE WHERE id = ?', [taskId]);
    console.log('任務通知狀態更新成功:', taskId);
  } catch (err) {
    console.error('markTaskAsNotified 錯誤:', { taskId, error: err.message, stack: err.stack });
    throw err;
  }
}

module.exports = { getTasks, addTask, editTask, deleteTask, checkUpcomingTasks, markTaskAsNotified };
```


## services\userService.js

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
  const [existing] = await query('SELECT * FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new Error('電郵地址已被使用');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, 'user']);
  console.log('用戶註冊成功:', { username, email });
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


## services\wordlistService.js

```js
const { query } = require('../db');

async function getWordlists(userId) {
  return await query('SELECT id, name FROM wordlists WHERE user_id = ?', [userId]);
}

async function createWordlist(userId, name, words) {
  const [result] = await query('INSERT INTO wordlists (user_id, name) VALUES (?, ?)', [userId, name]);
  const wordlistId = result.insertId;
  if (words && words.length > 0) {
    const wordValues = words.map(word => [wordlistId, word.english, word.chinese]);
    await query('INSERT INTO words (wordlist_id, english, chinese) VALUES ?', [wordValues]);
  }
  console.log('生字庫儲存成功:', { wordlistId, name });
  return wordlistId;
}

async function deleteWordlist(userId, wordlistId) {
  await query('DELETE FROM words WHERE wordlist_id = ?', [wordlistId]);
  await query('DELETE FROM wordlists WHERE id = ? AND user_id = ?', [wordlistId, userId]);
  console.log('生字庫刪除成功:', wordlistId);
}

module.exports = { getWordlists, createWordlist, deleteWordlist };
```


## services\wordService.js

```js
const { query } = require('../db');

async function getWordsByWordlist(wordlistId) {
  return await query('SELECT id, english, chinese FROM words WHERE wordlist_id = ?', [wordlistId]);
}

async function addWord(wordlistId, userId, english, chinese) {
  const [results] = await query('SELECT * FROM wordlists WHERE id = ? AND user_id = ?', [wordlistId, userId]);
  if (results.length === 0) {
    throw new Error('無效的生字庫或無權限');
  }
  const [result] = await query('INSERT INTO words (wordlist_id, english, chinese) VALUES (?, ?, ?)', 
    [wordlistId, english, chinese]);
  console.log('生字新增成功:', { wordlistId, english, chinese });
  return result.insertId;
}

async function updateWords(wordlistId, words) {
  await query('DELETE FROM words WHERE wordlist_id = ?', [wordlistId]);
  if (words && words.length > 0) {
    const wordValues = words.map(word => [wordlistId, word.english, word.chinese]);
    await query('INSERT INTO words (wordlist_id, english, chinese) VALUES ?', [wordValues]);
  }
  console.log('生字更新成功:', wordlistId);
}

module.exports = { getWordsByWordlist, addWord, updateWords };
```


## views\partials\pwa.ejs

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


## views\dashboard.ejs

```ejs
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/style.css" rel="stylesheet">
  <%- include('partials/pwa') %>
  <title>儀表板</title>
</head>
<body>
  <div class="container mt-5">
    <h2 class="text-center">歡迎登入技術人員內部網站</h2>
    <p class="text-center">用戶名稱：<%= username %></p>
    <div class="text-center mt-3">
      <a href="/dictation" class="btn btn-primary">背默英文生字</a>
      <a href="/taskmanager" class="btn btn-primary">任務管理</a>
      <a href="/filemanager" class="btn btn-primary">檔案管理</a>
      <% if (role === 'admin') { %>
        <a href="/admin" class="btn btn-primary">後台管理</a>
      <% } %>
      <a href="/logout" class="btn btn-secondary">登出</a>
    </div>
  </div>
</body>
</html>
```


## views\dictation.ejs

```ejs
<!DOCTYPE html>
<html lang="zh-HK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/style.css" rel="stylesheet">
  <%- include('partials/pwa') %>
  <title>背默英文生字</title>
</head>
<body class="min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);">
  <div class="container bg-white bg-opacity-10 border border-light border-opacity-20 rounded p-4 shadow">
    <h1 class="text-center text-white mb-4">背默英文生字</h1>
    
    <!-- 選擇或創建生字庫 -->
    <div id="wordlistSection" class="mb-4">
      <h2 class="text-center text-white mb-4">生字庫管理</h2>
      <div class="mb-3">
        <label for="wordlistSelect" class="form-label text-white">選擇現有生字庫</label>
        <div class="input-group">
          <select id="wordlistSelect" class="form-select mb-2">
            <option value="">-- 選擇生字庫 --</option>
            <% wordlists.forEach(wordlist => { %>
              <option value="<%= wordlist.id %>"><%= wordlist.name %></option>
            <% }) %>
          </select>
          <button onclick="deleteWordlist()" class="btn btn-danger mb-2" disabled id="deleteWordlistBtn">刪除</button>
        </div>
        <button onclick="loadWordlist()" class="btn btn-primary w-100">載入生字庫</button>
      </div>
      <div class="mb-3">
        <label for="wordlistName" class="form-label text-white">或輸入新生字庫名稱</label>
        <input type="text" id="wordlistName" class="form-control mb-2" placeholder="輸入生字庫名稱">
      </div>
    </div>

    <!-- 輸入生字及中文解釋區域 -->
    <div id="inputSection" class="mb-4">
      <p class="text-white text-opacity-75 mb-2">每行輸入一個生字，格式：英文,中文</p>
      <pre class="text-white text-opacity-75 bg-dark bg-opacity-25 p-2 rounded mb-2">
範例：Apple,蘋果
      </pre>
      <textarea id="wordInput" class="form-control mb-2" rows="5" placeholder="輸入英文,中文（每行一個生字）"></textarea>
      <button onclick="saveWords()" class="btn btn-primary w-100">儲存生字</button>
    </div>

    <!-- 生字列表區域 -->
    <div id="wordListSection" class="mb-4 d-none">
      <h2 class="text-center text-white mb-4">生字列表</h2>
      <!-- 新增生字輸入區域 -->
      <div class="mb-3">
        <label class="form-label text-white">新增生字</label>
        <div class="input-group">
          <input type="text" id="newWordEnglish" class="form-control" placeholder="英文單字">
          <input type="text" id="newWordChinese" class="form-control" placeholder="中文解釋">
          <button onclick="addNewWord()" class="btn btn-success">新增</button>
        </div>
      </div>
      <ul id="wordList" class="list-group mb-4"></ul>
      <button onclick="saveEditedWords()" class="btn btn-primary w-100 mb-2">儲存編輯</button>
      <button onclick="startQuiz()" class="btn btn-primary w-100">開始背默</button>
      <button onclick="resetQuiz()" class="btn btn-secondary w-100 mt-2">重新開始</button>
    </div>

    <!-- 背默區域 -->
    <div id="quizSection" class="d-none">
      <p class="text-white mb-2">請輸入以下中文解釋對應的英文單字：</p>
      <p id="currentMeaning" class="text-center text-info mb-4 fs-4"></p>
      <input id="userInput" type="text" class="form-control mb-2" placeholder="輸入英文單字" onkeypress="if(event.key === 'Enter') checkAnswer()">
      <button onclick="checkAnswer()" class="btn btn-primary w-100">檢查答案</button>
      <p id="result" class="mt-2 text-center"></p>
      <button onclick="resetQuiz()" class="btn btn-secondary w-100 mt-2">重新開始</button>
    </div>

    <!-- 結果區域 -->
    <div id="resultSection" class="d-none">
      <h2 class="text-center text-white mb-4">背默結果</h2>
      <p id="resultSummary" class="text-center text-white mb-4"></p>
      <ul id="resultDetails" class="list-group mb-4"></ul>
      <button onclick="resetQuiz()" class="btn btn-secondary w-100">重新開始</button>
    </div>
  </div>

  <script>
    let words = [];
    let usedIndices = [];
    let currentWordIndex = -1;
    let results = [];
    let currentWordlistId = null;

    // 當選擇生字庫時啟用刪除按鈕
    document.getElementById('wordlistSelect').addEventListener('change', function() {
      const deleteBtn = document.getElementById('deleteWordlistBtn');
      deleteBtn.disabled = this.value === '';
    });

    function saveWords() {
      const wordlistName = document.getElementById('wordlistName').value.trim();
      const input = document.getElementById('wordInput').value.trim();
      if (!wordlistName) {
        alert('請輸入生字庫名稱！');
        return;
      }
      const lines = input.split('\n').map(line => line.trim()).filter(line => line);
      words = lines.map(line => {
        const [english, chinese] = line.split(',').map(item => item.trim());
        return { english, chinese };
      }).filter(word => word.english && word.chinese);
      
      if (words.length === 0) {
        alert('請至少輸入一個有效的生字及中文解釋（格式：英文,中文）！');
        return;
      }

      // 使用 AJAX 儲存生字庫
      fetch('/dictation/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordlistName, words })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          currentWordlistId = data.wordlistId;
          document.getElementById('inputSection').classList.add('d-none');
          document.getElementById('wordlistSection').classList.add('d-none');
          document.getElementById('wordListSection').classList.remove('d-none');
          displayWordList();
          // 更新生字庫選單
          const select = document.getElementById('wordlistSelect');
          const option = document.createElement('option');
          option.value = data.wordlistId;
          option.textContent = wordlistName;
          select.appendChild(option);
        } else {
          alert(data.error || '儲存生字庫失敗，請稍後重試');
        }
      })
      .catch(err => {
        console.error('Save Error:', err);
        alert('儲存生字庫失敗，請稍後重試');
      });
    }

    function loadWordlist() {
      const wordlistId = document.getElementById('wordlistSelect').value;
      if (!wordlistId) {
        alert('請選擇一個生字庫！');
        return;
      }

      // 使用 AJAX 取得生字庫中的生字
      fetch(`/dictation/words/${wordlistId}`)
      .then(response => response.json())
      .then(data => {
        words = data;
        currentWordlistId = wordlistId;
        if (words.length > 0) {
          document.getElementById('wordlistSection').classList.add('d-none');
          document.getElementById('inputSection').classList.add('d-none');
          document.getElementById('wordListSection').classList.remove('d-none');
          displayWordList();
        } else {
          alert('該生字庫為空！');
        }
      })
      .catch(err => {
        console.error('Load Error:', err);
        alert('載入生字庫失敗，請稍後重試');
      });
    }

    function deleteWordlist() {
      const wordlistId = document.getElementById('wordlistSelect').value;
      if (!wordlistId) {
        alert('請選擇一個生字庫！');
        return;
      }
      if (!confirm('確定要刪除此生字庫嗎？此操作無法恢復！')) {
        return;
      }

      // 使用 AJAX 刪除生字庫
      fetch(`/dictation/wordlist/${wordlistId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const select = document.getElementById('wordlistSelect');
          const option = select.querySelector(`option[value="${wordlistId}"]`);
          option.remove();
          select.value = '';
          document.getElementById('deleteWordlistBtn').disabled = true;
          alert('生字庫已刪除！');
        } else {
          alert(data.error || '刪除生字庫失敗，請稍後重試');
        }
      })
      .catch(err => {
        console.error('Delete Error:', err);
        alert('刪除生字庫失敗，請稍後重試');
      });
    }

    function addNewWord() {
      if (!currentWordlistId) {
        alert('請先載入或儲存一個生字庫！');
        return;
      }
      const english = document.getElementById('newWordEnglish').value.trim();
      const chinese = document.getElementById('newWordChinese').value.trim();
      if (!english || !chinese) {
        alert('請輸入英文單字和中文解釋！');
        return;
      }

      // 使用 AJAX 新增單個生字
      fetch(`/dictation/word/${currentWordlistId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ english, chinese })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          words.push({ id: data.wordId, english, chinese });
          document.getElementById('newWordEnglish').value = '';
          document.getElementById('newWordChinese').value = '';
          displayWordList();
          alert('生字已新增！');
        } else {
          alert(data.error || '新增生字失敗，請稍後重試');
        }
      })
      .catch(err => {
        console.error('Add Word Error:', err);
        alert('新增生字失敗，請稍後重試');
      });
    }

    function displayWordList() {
      const wordList = document.getElementById('wordList');
      wordList.innerHTML = '';
      words.forEach((word, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item bg-dark bg-opacity-25 text-white d-flex align-items-center';
        li.innerHTML = `
          <input type="text" class="form-control mx-2" style="width: 150px;" value="${word.english}" data-index="${index}" data-field="english">
          <span>-</span>
          <input type="text" class="form-control mx-2" style="width: 150px;" value="${word.chinese}" data-index="${index}" data-field="chinese">
          <button class="btn btn-sm btn-info mx-1" onclick="speakWord('${word.english}')">發音</button>
          <button class="btn btn-sm btn-warning mx-1" onclick="editWord(${index})">編輯</button>
          <button class="btn btn-sm btn-danger" onclick="deleteWord(${index})">刪除</button>
        `;
        wordList.appendChild(li);
      });
    }

    function editWord(index) {
      const englishInput = document.querySelector(`input[data-index="${index}"][data-field="english"]`);
      const chineseInput = document.querySelector(`input[data-index="${index}"][data-field="chinese"]`);
      words[index].english = englishInput.value.trim();
      words[index].chinese = chineseInput.value.trim();
    }

    function deleteWord(index) {
      if (confirm('確定要刪除此生字嗎？')) {
        words.splice(index, 1);
        displayWordList();
      }
    }

    function saveEditedWords() {
      if (!currentWordlistId) {
        alert('請先載入或儲存一個生字庫！');
        return;
      }

      // 使用 AJAX 更新生字庫
      fetch(`/dictation/words/${currentWordlistId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('生字已更新！');
          displayWordList();
        } else {
          alert(data.error || '更新生字失敗，請稍後重試');
        }
      })
      .catch(err => {
        console.error('Update Error:', err);
        alert('更新生字失敗，請稍後重試');
      });
    }

    function speakWord(word) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-GB';
      window.speechSynthesis.speak(utterance);
    }

    function startQuiz() {
      document.getElementById('wordListSection').classList.add('d-none');
      document.getElementById('quizSection').classList.remove('d-none');
      usedIndices = [];
      results = [];
      nextWord();
    }

    function nextWord() {
      if (usedIndices.length >= words.length) {
        showResults();
        return;
      }

      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * words.length);
      } while (usedIndices.includes(newIndex));
      
      usedIndices.push(newIndex);
      currentWordIndex = newIndex;
      document.getElementById('currentMeaning').textContent = words[currentWordIndex].chinese;
      document.getElementById('userInput').value = '';
      document.getElementById('result').textContent = '';
      document.getElementById('userInput').focus();
    }

    function checkAnswer() {
      const userAnswer = document.getElementById('userInput').value.trim().toLowerCase();
      const correctAnswer = words[currentWordIndex].english.toLowerCase();
      const resultElement = document.getElementById('result');
      
      const isCorrect = userAnswer === correctAnswer;
      results.push({
        english: words[currentWordIndex].english,
        chinese: words[currentWordIndex].chinese,
        userAnswer,
        isCorrect
      });

      if (isCorrect) {
        resultElement.textContent = '正確！';
        resultElement.className = 'mt-2 text-center text-success';
      } else {
        resultElement.textContent = `錯誤，正確答案是：${words[currentWordIndex].english}`;
        resultElement.className = 'mt-2 text-center text-danger';
      }

      speakWord(words[currentWordIndex].english);

      if (usedIndices.length < words.length) {
        setTimeout(nextWord, 2000);
      } else {
        setTimeout(showResults, 2000);
      }
    }

    function showResults() {
      document.getElementById('quizSection').classList.add('d-none');
      document.getElementById('resultSection').classList.remove('d-none');
      
      const correctCount = results.filter(r => r.isCorrect).length;
      const totalCount = results.length;
      const summary = `你答對了 ${correctCount} / ${totalCount} 個單字！`;
      document.getElementById('resultSummary').textContent = summary;

      const detailsList = document.getElementById('resultDetails');
      detailsList.innerHTML = '';
      results.forEach(result => {
        const li = document.createElement('li');
        li.className = `list-group-item ${result.isCorrect ? 'text-success' : 'text-danger'}`;
        li.innerHTML = `<span class="cursor-pointer text-info" onclick="speakWord('${result.english}')">${result.english}</span> (${result.chinese}): 你的答案 - ${result.userAnswer || '無'} (${result.isCorrect ? '正確' : '錯誤'})`;
        detailsList.appendChild(li);
      });
    }

    function resetQuiz() {
      document.getElementById('wordlistSection').classList.remove('d-none');
      document.getElementById('inputSection').classList.remove('d-none');
      document.getElementById('wordListSection').classList.add('d-none');
      document.getElementById('quizSection').classList.add('d-none');
      document.getElementById('resultSection').classList.add('d-none');
      document.getElementById('wordInput').value = '';
      document.getElementById('wordlistName').value = '';
      document.getElementById('wordlistSelect').value = '';
      document.getElementById('deleteWordlistBtn').disabled = true;
      document.getElementById('newWordEnglish').value = '';
      document.getElementById('newWordChinese').value = '';
      words = [];
      usedIndices = [];
      currentWordIndex = -1;
      results = [];
      currentWordlistId = null;
    }
  </script>
</body>
</html>
```


## views\filemanager.ejs

```ejs
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/style.css" rel="stylesheet">
  <%- include('partials/pwa') %>
  <!-- 引入 moment.js 和 moment-timezone -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.45/moment-timezone-with-data.min.js"></script>
  <title>檔案管理</title>
  <style>
    .thumbnail {
      max-width: 50px;
      max-height: 50px;
      margin-right: 10px;
      vertical-align: middle;
    }
  </style>
</head>
<body>
  <div class="container mt-5">
    <h2 class="text-center text-white mb-4">檔案管理</h2>
    
    <!-- 檔案上傳區域 -->
    <div class="mb-4">
      <h3 class="text-white">上傳檔案</h3>
      <form id="fileUploadForm" enctype="multipart/form-data">
        <div class="mb-3">
          <label for="customName" class="form-label text-white">檔案名稱</label>
          <input type="text" id="customName" name="customName" class="form-control" placeholder="輸入自訂檔案名稱" required>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label text-white">檔案描述</label>
          <textarea id="description" name="description" class="form-control" placeholder="輸入檔案描述（可選）" rows="3"></textarea>
        </div>
        <div class="mb-3">
          <label for="fileInput" class="form-label text-white">選擇檔案</label>
          <input type="file" id="fileInput" name="file" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">上傳</button>
      </form>
    </div>

    <!-- 檔案列表區域 -->
    <div class="mt-4">
      <h3 class="text-white">檔案列表</h3>
      <ul id="fileList" class="list-group"></ul>
    </div>

    <!-- 編輯模態框 -->
    <div class="modal fade" id="editFileModal" tabindex="-1" aria-labelledby="editFileModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editFileModalLabel">編輯檔案資訊</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉"></button>
          </div>
          <div class="modal-body">
            <form id="editFileForm">
              <input type="hidden" id="editFilename">
              <div class="mb-3">
                <label for="editCustomName" class="form-label">檔案名稱</label>
                <input type="text" id="editCustomName" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="editDescription" class="form-label">檔案描述</label>
                <textarea id="editDescription" class="form-control" rows="3"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" onclick="saveFileChanges()">儲存</button>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-3">
      <a href="/dashboard" class="btn btn-secondary">返回儀表板</a>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    // 載入檔案列表
    function loadFiles() {
      fetch('/filemanager/files')
        .then(response => response.json())
        .then(data => {
          const fileList = document.getElementById('fileList');
          fileList.innerHTML = '';
          if (!Array.isArray(data) || data.length === 0) {
            const li = document.createElement('li');
            li.className = 'list-group-item text-center';
            li.textContent = '暫無檔案';
            fileList.appendChild(li);
            return;
          }
          data.forEach(file => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            const isImage = file.mime_type === 'image/jpeg' || file.mime_type === 'image/png';
            li.innerHTML = `
              <div>
                ${isImage ? `<img src="/uploads/${file.filename}" alt="${file.custom_name || file.original_name}" class="thumbnail">` : ''}
                <a href="/Uploads/${file.filename}" target="_blank" class="text-info">${file.custom_name || file.original_name}</a>
                <small class="d-block text-muted">原始檔案: ${file.original_name}</small>
                <small class="d-block text-muted">描述: ${file.description || '無'}</small>
                <small class="d-block text-muted">上傳時間: ${formatDisplayDateTime(file.uploaded_at)}</small>
              </div>
              <div>
                <button class="btn btn-sm btn-warning me-2" onclick="openEditModal('${file.filename}', '${file.custom_name}', '${file.description || ''}')">編輯</button>
                <button class="btn btn-sm btn-danger" onclick="deleteFile('${file.filename}')">刪除</button>
              </div>
            `;
            fileList.appendChild(li);
          });
        })
        .catch(err => {
          console.error('載入檔案列表失敗:', err);
          alert('載入檔案列表失敗，請稍後重試');
        });
    }

    // 格式化顯示日期時間
    function formatDisplayDateTime(datetime) {
      return moment(datetime).tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm');
    }

    // 開啟編輯模態框
    function openEditModal(filename, customName, description) {
      document.getElementById('editFilename').value = filename;
      document.getElementById('editCustomName').value = customName;
      document.getElementById('editDescription').value = description;
      const modal = new bootstrap.Modal(document.getElementById('editFileModal'));
      modal.show();
    }

    // 儲存檔案資訊變更
    function saveFileChanges() {
      const filename = document.getElementById('editFilename').value;
      const customName = document.getElementById('editCustomName').value.trim();
      const description = document.getElementById('editDescription').value.trim();
      if (!customName) {
        alert('請輸入檔案名稱！');
        return;
      }

      fetch(`/filemanager/edit/${filename}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': document.cookie
        },
        body: JSON.stringify({ customName, description })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('檔案資訊已更新！');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editFileModal'));
            modal.hide();
            loadFiles();
          } else {
            alert(data.error || '更新檔案資訊失敗');
          }
        })
        .catch(err => {
          console.error('更新檔案資訊錯誤:', err);
          alert('更新檔案資訊失敗: ' + err.message);
        });
    }

    // 上傳檔案
    document.getElementById('fileUploadForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const fileInput = document.getElementById('fileInput');
      const customName = document.getElementById('customName').value.trim();
      const description = document.getElementById('description').value.trim();
      const file = fileInput.files[0];
      if (!file) {
        alert('請選擇一個檔案！');
        return;
      }
      if (!customName) {
        alert('請輸入檔案名稱！');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('customName', customName);
      formData.append('description', description);

      fetch('/filemanager/upload', {
        method: 'POST',
        body: formData,
        headers: { 'Cookie': document.cookie }
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('檔案上傳成功！');
            fileInput.value = '';
            document.getElementById('customName').value = '';
            document.getElementById('description').value = '';
            loadFiles();
          } else {
            alert(data.error || '檔案上傳失敗');
          }
        })
        .catch(err => {
          console.error('檔案上傳錯誤:', err);
          alert('檔案上傳失敗: ' + err.message);
        });
    });

    // 刪除檔案
    function deleteFile(filename) {
      if (!confirm(`確定要刪除檔案 "${filename}" 嗎？`)) {
        return;
      }
      fetch(`/filemanager/delete/${filename}`, {
        method: 'DELETE',
        headers: { 'Cookie': document.cookie }
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('檔案已刪除！');
            loadFiles();
          } else {
            alert(data.error || '刪除檔案失敗');
          }
        })
        .catch(err => {
          console.error('刪除檔案錯誤:', err);
          alert('刪除檔案失敗: ' + err.message);
        });
    }

    // 頁面載入時執行
    document.addEventListener('DOMContentLoaded', function () {
      loadFiles();
    });
  </script>
</body>
</html>
```


## views\index.ejs

```ejs
<!DOCTYPE html>
<html lang="zh-HK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- SEO 元標籤 -->
  <meta name="description" content="<%= siteSettings.index_meta_description %>">
  <meta name="keywords" content="<%= siteSettings.index_meta_keywords %>">
  <meta name="robots" content="index, follow">
  <!-- 網站標題 -->
  <title><%= siteSettings.site_title %> - 高效學習與管理平台</title>
  <!-- Open Graph 標籤 -->
  <meta property="og:title" content="<%= siteSettings.index_og_title %>">
  <meta property="og:description" content="<%= siteSettings.index_og_description %>">
  <meta property="og:url" content="https://tools.mysandshome.com">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://tools.mysandshome.com/images/icon-512x512.png">
  <!-- 網站地圖 -->
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <!-- PWA 相關 -->
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" href="/images/icon-192x192.png">
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- 自定義樣式 -->
  <link rel="stylesheet" href="/style.css">
</head>
<body class="bg-dark text-white">
  <!-- 導航欄 -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container">
      <a class="navbar-brand" href="/"><%= siteSettings.site_title %></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="#home">首頁</a></li>
          <li class="nav-item"><a class="nav-link" href="#features">功能</a></li>
          <li class="nav-item"><a class="nav-link" href="#about">關於</a></li>
          <li class="nav-item"><a class="nav-link" href="#contact">聯繫</a></li>
          <li class="nav-item"><a class="nav-link" href="/login">登入</a></li>
          <li class="nav-item"><a class="nav-link" href="/register">註冊</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- 首頁區塊 -->
  <section id="home" class="vh-100 d-flex align-items-center justify-content-center text-center">
    <div class="container">
      <h1 class="display-4 fw-bold mb-4"><%= siteSettings.site_title %></h1>
      <p class="lead mb-4"><%= siteSettings.index_og_description %></p>
      <a href="/register" class="btn btn-primary btn-lg">立即註冊</a>
    </div>
  </section>

  <!-- 功能區塊 -->
  <section id="features" class="py-5">
    <div class="container">
      <h2 class="text-center text-white mb-5">核心功能</h2>
      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="container bg-white bg-opacity-10 border border-light border-opacity-20 rounded p-4 shadow">
            <h3 class="text-white">生字庫管理</h3>
            <p class="text-white text-opacity-75">輕鬆創建和編輯專屬的英文生字庫，幫助技術人員高效記憶單字，提升英語能力。</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="container bg-white bg-opacity-10 border border-light border-opacity-20 rounded p-4 shadow">
            <h3 class="text-white">任務管理</h3>
            <p class="text-white text-opacity-75">使用日曆和任務清單管理您的學習和工作進度，確保高效完成目標。</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="container bg-white bg-opacity-10 border border-light border-opacity-20 rounded p-4 shadow">
            <h3 class="text-white">檔案管理</h3>
            <p class="text-white text-opacity-75">安全上傳和整理學習資料，隨時隨地訪問您的檔案。</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 關於區塊 -->
  <section id="about" class="py-5">
    <div class="container">
      <h2 class="text-center text-white mb-5">關於我們</h2>
      <p class="text-white text-opacity-75 text-center">技術人員內部網站是一個專為技術人員打造的學習與管理工具，結合 PWA 技術，提供離線使用和推送通知功能。我們致力於幫助技術人員提升英文能力並優化工作效率。</p>
    </div>
  </section>

  <!-- 聯繫區塊 -->
  <section id="contact" class="py-5">
    <div class="container">
      <h2 class="text-center text-white mb-5">聯繫我們</h2>
      <p class="text-white text-opacity-75 text-center">有任何問題或建議？請通過以下方式聯繫我們：</p>
      <ul class="list-unstyled text-center">
        <li><a href="mailto:support@mysandshome.com" class="text-white">Email: support@mysandshome.com</a></li>
        <li><a href="https://github.com/thisismak" class="text-white">GitHub: thisismak</a></li>
      </ul>
    </div>
  </section>

  <!-- 頁尾 -->
  <footer class="bg-dark text-white text-center py-3">
    <p>&copy; 2025 <%= siteSettings.site_title %>. All Rights Reserved.</p>
  </footer>

  <!-- Bootstrap 和自定義腳本 -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="/script.js"></script>
  <!-- Service Worker 註冊 -->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('Service Worker registered'))
          .catch(err => console.error('Service Worker registration failed:', err));
      });
    }
  </script>
</body>
</html>
```


## views\login.ejs

```ejs
<!DOCTYPE html>
   <html lang="zh-TW">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
     <link href="/css/style.css" rel="stylesheet">
     <%- include('partials/pwa') %>
     <title>登入</title>
   </head>
   <body>
     <div class="container mt-5">
       <h2 class="text-center">技術人員內部網站 - 登入</h2>
       <% if (error) { %>
         <div class="alert alert-danger" role="alert"><%= error %></div>
       <% } %>
       <form action="/login" method="POST" class="mt-4">
         <div class="mb-3">
           <input type="text" name="username" class="form-control" placeholder="用戶名" required>
         </div>
         <div class="mb-3">
           <input type="password" name="password" class="form-control" placeholder="密碼" required>
         </div>
         <button type="submit" class="btn btn-primary w-100">登入</button>
       </form>
       <div class="text-center mt-3">
         <p>還沒有帳號？ <a href="/register" class="text-info">立即註冊</a></p>
       </div>
     </div>
   </body>
   </html>
```


## views\register.ejs

```ejs
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/style.css" rel="stylesheet">
  <%- include('partials/pwa') %>
  <title>註冊</title>
</head>
<body>
  <div class="container mt-5">
    <h2 class="text-center">技術人員內部網站 - 註冊</h2>
    <% if (error) { %>
      <div class="alert alert-danger" role="alert"><%= error %></div>
    <% } %>
    <form action="/register" method="POST" class="mt-4">
      <div class="mb-3">
        <input type="text" name="username" class="form-control" placeholder="用戶名" required>
      </div>
      <div class="mb-3">
        <input type="email" name="email" class="form-control" placeholder="電郵地址" required>
      </div>
      <div class="mb-3">
        <input type="password" name="password" class="form-control" placeholder="密碼" required>
      </div>
      <button type="submit" class="btn btn-primary w-100">註冊</button>
    </form>
    <div class="text-center mt-3">
      <p>已有帳號？ <a href="/login" class="text-info">返回登入</a></p>
    </div>
  </div>
</body>
</html>
```


## views\sitemap.ejs

```ejs
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tools.mysandshome.com/</loc>
    <lastmod><%= new Date().toISOString().split('T')[0] %></lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tools.mysandshome.com/login</loc>
    <lastmod><%= new Date().toISOString().split('T')[0] %></lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tools.mysandshome.com/register</loc>
    <lastmod><%= new Date().toISOString().split('T')[0] %></lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```


## views\taskmanager.ejs

```ejs
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/style.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/main.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.45/moment-timezone-with-data.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>
  <script src="/js/taskmanager.js" defer></script>
  <script data-vapid-key="<%= VAPID_PUBLIC_KEY %>"></script>
  <title>任務管理</title>
</head>
<body>
  <div class="container mt-5">
    <h2 class="text-center text-white mb-4">任務管理</h2>
    <form id="taskForm">
      <input type="hidden" id="taskId">
      <div class="mb-3">
        <label for="title" class="form-label text-white">任務標題</label>
        <input type="text" id="title" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label text-white">任務描述</label>
        <textarea id="description" class="form-control" rows="3"></textarea>
      </div>
      <div class="mb-3">
        <label for="dueDate" class="form-label text-white">到期日期</label>
        <input type="date" id="dueDate" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="dueTime" class="form-label text-white">到期時間</label>
        <input type="time" id="dueTime" class="form-control" required>
      </div>
      <button type="button" onclick="saveTask()" class="btn btn-primary">儲存任務</button>
    </form>
    <div class="mt-4">
      <ul id="taskList" class="list-group"></ul>
    </div>
    <div class="mt-4">
      <h2 class="text-center text-white">任務日曆</h2>
      <div id="calendar"></div>
    </div>
  </div>
</body>
</html>
```


## .env

```
# DB_HOST=10.0.0.30
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


## .gitignore

```
# Node.js 相關
node_modules/
package-lock.json
```


## app.js

```js
require('dotenv').config();
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
const multer = require('multer');
const path = require('path');

process.env.TZ = 'Asia/Hong_Kong';

const app = express();

// 配置 Multer 檔案上傳
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fileService.ensureUploadDir();
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 限制檔案大小為 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('僅支援 JPEG、PNG、PDF 和純文本檔案'));
    }
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');

webpush.setVapidDetails(
  'mailto:support@mysandshome.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

initializeDatabase().catch(err => {
  console.error('Failed to initialize database:', err.message);
  process.exit(1);
});

// 載入站點設定
async function loadSiteSettings() {
  try {
    const results = await query('SELECT setting_key, setting_value FROM site_settings');
    const settings = {};
    results.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    return settings;
  } catch (err) {
    console.error('載入站點設定失敗:', err.message);
    return {
      site_title: '技術人員內部網站',
      index_meta_description: '技術人員內部網站，提供英文生字背默、任務管理和檔案管理功能，助力技術人員高效學習和工作。',
      index_meta_keywords: '技術人員, 英文學習, 生字背默, 任務管理, 檔案管理, PWA應用',
      index_og_title: '技術人員內部網站 - 高效學習與管理平台',
      index_og_description: '專為技術人員設計的學習與管理工具，支持英文生字背默、任務管理和檔案管理，提升工作效率。',
      login_meta_description: '登入技術人員內部網站，管理您的學習和工作任務。',
      login_meta_keywords: '技術人員, 登入, 學習管理, 任務管理',
      login_og_title: '技術人員內部網站 - 登入',
      login_og_description: '登入技術人員內部網站，開始管理您的學習和工作任務。',
      register_meta_description: '註冊技術人員內部網站，體驗高效的學習與管理工具。',
      register_meta_keywords: '技術人員, 註冊, 學習管理, PWA應用',
      register_og_title: '技術人員內部網站 - 註冊',
      register_og_description: '立即註冊技術人員內部網站，體驗高效的學習與管理工具。'
    };
  }
}

// 管理員權限中間件
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (user.role !== 'admin') {
      console.warn('非管理員嘗試訪問後台:', { userId: req.user.id });
      return res.status(403).json({ success: false, error: '無管理員權限' });
    }
    next();
  } catch (err) {
    console.error('檢查管理員權限失敗:', err.message);
    res.redirect('/login');
  }
};

// 記錄日誌的輔助函數
async function logActivity(userId, action, details) {
  try {
    await query('INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)', 
      [userId, action, details]);
    console.log('活動日誌記錄:', { userId, action, details });
  } catch (err) {
    console.error('記錄日誌失敗:', err.message);
  }
}

// 公開頁面路由
app.get('/', async (req, res) => {
  const settings = await loadSiteSettings();
  res.render('index', { siteSettings: settings });
});

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const settings = await loadSiteSettings();
    res.header('Content-Type', 'application/xml');
    res.render('sitemap', { settings });
  } catch (err) {
    console.error('生成sitemap失敗:', err.message);
    res.status(500).send('生成網站地圖失敗');
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
    await logActivity(null, '用戶註冊', `新用戶註冊: ${username} (${email})`);
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
  console.log('登入請求:', { username, password: '[隱藏]' });
  try {
    const token = await userService.loginUser(username, password);
    res.cookie('token', token, { httpOnly: true });
    await logActivity(null, '用戶登入', `用戶 ${username} 登入`);
    res.redirect('/dashboard');
  } catch (err) {
    const settings = await loadSiteSettings();
    res.render('login', { error: err.message, siteSettings: settings });
  }
});

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.warn('無 JWT 令牌，導向登入頁面');
    return res.redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    res.redirect('/login');
  }
};

// 後台路由
app.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    await logActivity(req.user.id, '訪問後台儀表板', `用戶 ${user.username} 訪問了後台儀表板`);
    res.render('admin/dashboard', { username: user.username });
  } catch (err) {
    console.error('載入後台儀表板失敗:', err.message);
    res.status(500).json({ success: false, error: '載入儀表板失敗' });
  }
});

app.get('/admin/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    await logActivity(req.user.id, '查看用戶列表', '訪問了用戶管理頁面');
    res.render('admin/users', { users });
  } catch (err) {
    console.error('載入用戶列表失敗:', err.message);
    res.status(500).json({ success: false, error: '載入用戶列表失敗' });
  }
});

app.put('/admin/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { username, email, role } = req.body;
  try {
    const result = await query(
      'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
      [username, email, role, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: '用戶不存在' });
    }
    await logActivity(req.user.id, '編輯用戶', `編輯了用戶ID: ${req.params.id}`);
    res.json({ success: true });
  } catch (err) {
    console.error('編輯用戶失敗:', err.message);
    res.status(500).json({ success: false, error: '編輯用戶失敗' });
  }
});

app.delete('/admin/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: '用戶不存在' });
    }
    await logActivity(req.user.id, '刪除用戶', `刪除了用戶ID: ${req.params.id}`);
    res.json({ success: true });
  } catch (err) {
    console.error('刪除用戶失敗:', err.message);
    res.status(500).json({ success: false, error: '刪除用戶失敗' });
  }
});

app.get('/admin/tasks', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const tasks = await query(`
      SELECT t.*, u.username 
      FROM tasks t 
      LEFT JOIN users u ON t.user_id = u.id
    `);
    await logActivity(req.user.id, '查看任務列表', '訪問了任務管理頁面');
    res.render('admin/tasks', { tasks, moment });
  } catch (err) {
    console.error('載入任務列表失敗:', err.message);
    res.status(500).json({ success: false, error: '載入任務列表失敗' });
  }
});

app.delete('/admin/tasks/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: '任務不存在' });
    }
    await logActivity(req.user.id, '刪除任務', `刪除了任務ID: ${req.params.id}`);
    res.json({ success: true });
  } catch (err) {
    console.error('刪除任務失敗:', err.message);
    res.status(500).json({ success: false, error: '刪除任務失敗' });
  }
});

app.get('/admin/files', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const files = await query(`
      SELECT f.*, u.username 
      FROM files f 
      LEFT JOIN users u ON f.user_id = u.id
    `);
    await logActivity(req.user.id, '查看檔案列表', '訪問了檔案管理頁面');
    res.render('admin/files', { files, moment });
  } catch (err) {
    console.error('載入檔案列表失敗:', err.message);
    res.status(500).json({ success: false, error: '載入檔案列表失敗' });
  }
});

app.delete('/admin/files/:filename', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await fileService.deleteFile(null, req.params.filename);
    await logActivity(req.user.id, '刪除檔案', `刪除了檔案: ${req.params.filename}`);
    res.json({ success: true });
  } catch (err) {
    console.error('刪除檔案失敗:', err.message);
    res.status(500).json({ success: false, error: '刪除檔案失敗' });
  }
});

app.get('/admin/dictation', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const wordlists = await query(`
      SELECT w.*, u.username, COUNT(words.id) as word_count
      FROM wordlists w
      LEFT JOIN users u ON w.user_id = u.id
      LEFT JOIN words ON w.id = words.wordlist_id
      GROUP BY w.id
    `);
    await logActivity(req.user.id, '查看生字庫列表', '訪問了生字管理頁面');
    res.render('admin/dictation', { wordlists });
  } catch (err) {
    console.error('載入生字庫列表失敗:', err.message);
    res.status(500).json({ success: false, error: '載入生字庫列表失敗' });
  }
});

app.get('/admin/dictation/words/:wordlistId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const words = await wordService.getWordsByWordlist(req.params.wordlistId);
    res.json(words);
  } catch (err) {
    console.error('載入生字失敗:', err.message);
    res.status(500).json({ success: false, error: '載入生字失敗' });
  }
});

app.delete('/admin/dictation/:wordlistId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await wordlistService.deleteWordlist(null, req.params.wordlistId);
    await logActivity(req.user.id, '刪除生字庫', `刪除了生字庫ID: ${req.params.wordlistId}`);
    res.json({ success: true });
  } catch (err) {
    console.error('刪除生字庫失敗:', err.message);
    res.status(500).json({ success: false, error: '刪除生字庫失敗' });
  }
});

app.get('/admin/settings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const settings = await loadSiteSettings();
    await logActivity(req.user.id, '查看系統設定', '訪問了系統設定頁面');
    res.render('admin/settings', { settings });
  } catch (err) {
    console.error('載入系統設定失敗:', err.message);
    res.status(500).json({ success: false, error: '載入系統設定失敗' });
  }
});

app.post('/admin/settings', verifyToken, verifyAdmin, async (req, res) => {
  const { site_title, vapid_public_key } = req.body;
  try {
    await query('UPDATE site_settings SET setting_value = ? WHERE setting_key = ?', [site_title, 'site_title']);
    await query('UPDATE site_settings SET setting_value = ? WHERE setting_key = ?', [vapid_public_key, 'vapid_public_key']);
    await logActivity(req.user.id, '更新系統設定', `更新了站點標題和VAPID公鑰`);
    res.json({ success: true });
  } catch (err) {
    console.error('更新系統設定失敗:', err.message);
    res.status(500).json({ success: false, error: '更新系統設定失敗' });
  }
});

app.get('/admin/seo', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const settings = await loadSiteSettings();
    await logActivity(req.user.id, '查看SEO設定', '訪問了SEO管理頁面');
    res.render('admin/seo', { settings });
  } catch (err) {
    console.error('載入SEO設定失敗:', err.message);
    res.status(500).json({ success: false, error: '載入SEO設定失敗' });
  }
});

app.post('/admin/seo', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await query('UPDATE site_settings SET setting_value = ? WHERE setting_key = ?', [value, key]);
    }
    await logActivity(req.user.id, '更新SEO設定', '更新了SEO元標籤');
    res.json({ success: true });
  } catch (err) {
    console.error('更新SEO設定失敗:', err.message);
    res.status(500).json({ success: false, error: '更新SEO設定失敗' });
  }
});

app.get('/admin/logs', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const logs = await query(`
      SELECT l.*, u.username 
      FROM activity_logs l 
      LEFT JOIN users u ON l.user_id = u.id 
      ORDER BY l.created_at DESC 
      LIMIT 100
    `);
    await logActivity(req.user.id, '查看日誌', '訪問了日誌查看頁面');
    res.render('admin/logs', { logs, moment });
  } catch (err) {
    console.error('載入日誌失敗:', err.message);
    res.status(500).json({ success: false, error: '載入日誌失敗' });
  }
});

app.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    console.log('載入 dashboard:', { userId: req.user.id, username: user ? user.username : '未找到用戶', role: user ? user.role : 'user' });
    res.render('dashboard', { 
      username: user ? user.username : '未知', 
      role: user ? user.role : 'user'  // 新增這行：傳遞 role 變數
    });
  } catch (err) {
    console.error('載入 dashboard 錯誤:', { userId: req.user.id, error: err.message, stack: err.stack });
    res.render('dashboard', { username: '未知', role: 'user' });  // 錯誤時也提供預設 role
  }
});

app.get('/dictation', verifyToken, async (req, res) => {
  try {
    const wordlists = await wordlistService.getWordlists(req.user.id);
    res.render('dictation', { wordlists });
  } catch (err) {
    res.render('dictation', { wordlists: [] });
  }
});

app.post('/dictation/save', verifyToken, async (req, res) => {
  const { wordlistName, words } = req.body;
  if (!wordlistName || !words || !Array.isArray(words)) {
    return res.status(400).json({ success: false, error: '請提供生字庫名稱和有效的生字列表' });
  }
  try {
    const wordlistId = await wordlistService.createWordlist(req.user.id, wordlistName, words);
    res.json({ success: true, wordlistId });
  } catch (err) {
    res.status(500).json({ success: false, error: '儲存生字庫失敗' });
  }
});

app.get('/dictation/words/:wordlistId', verifyToken, async (req, res) => {
  try {
    const words = await wordService.getWordsByWordlist(req.params.wordlistId);
    res.json(words);
  } catch (err) {
    res.status(500).json({ success: false, error: '取得生字失敗' });
  }
});

app.delete('/dictation/wordlist/:wordlistId', verifyToken, async (req, res) => {
  try {
    await wordlistService.deleteWordlist(req.user.id, req.params.wordlistId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: '刪除生字庫失敗' });
  }
});

app.put('/dictation/words/:wordlistId', verifyToken, async (req, res) => {
  const { words } = req.body;
  if (!words || !Array.isArray(words)) {
    return res.status(400).json({ success: false, error: '請提供有效的生字列表' });
  }
  try {
    await wordService.updateWords(req.params.wordlistId, words);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: '更新生字失敗' });
  }
});

app.post('/dictation/word/:wordlistId', verifyToken, async (req, res) => {
  const { english, chinese } = req.body;
  if (!english || !chinese) {
    return res.status(400).json({ success: false, error: '請提供英文和中文解釋' });
  }
  try {
    const wordId = await wordService.addWord(req.params.wordlistId, req.user.id, english, chinese);
    res.json({ success: true, wordId });
  } catch (err) {
    res.status(err.message.includes('無效的生字庫') ? 403 : 500).json({ success: false, error: err.message });
  }
});

app.get('/taskmanager', verifyToken, async (req, res) => {
  const settings = await loadSiteSettings();
  res.render('taskmanager', { VAPID_PUBLIC_KEY: settings.vapid_public_key });
});

app.get('/vapidPublicKey', async (req, res) => {
  const settings = await loadSiteSettings();
  res.send(settings.vapid_public_key);
});

app.post('/subscribe', verifyToken, async (req, res) => {
  try {
    await subscriptionService.saveSubscription(req.user.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error('訂閱路由錯誤:', { userId: req.user?.id, error: err.message, stack: err.stack });
    res.status(500).json({ success: false, error: '儲存訂閱失敗' });
  }
});

app.post('/test-push', verifyToken, async (req, res) => {
  try {
    const subscription = await subscriptionService.getSubscription(req.user.id);
    await webpush.sendNotification(subscription, JSON.stringify({
      title: '測試通知',
      body: '這是一條測試推送通知！',
      icon: '/images/icon-192x192.png',
      url: '/taskmanager'
    }));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

setInterval(async () => {
  try {
    const tasks = await taskService.checkUpcomingTasks();
    console.log('檢查即將到期任務:', tasks.length, '個任務');
    for (const task of tasks) {
      const payload = {
        title: '任務提醒',
        body: `您的任務 "${task.title}" 將於 ${moment(task.due_date).tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm')} 到期！`,
        icon: '/images/icon-192x192.png',
        url: '/taskmanager'
      };
      for (const subscription of task.subscriptions) {
        try {
          await webpush.sendNotification(subscription, JSON.stringify(payload));
          console.log('推送通知發送成功:', task.id, subscription.endpoint);
        } catch (err) {
          console.error('Push Notification Error, 任務ID:', task.id, '用戶ID:', task.user_id, '訂閱:', subscription.endpoint, '錯誤:', err.message);
        }
      }
      await taskService.markTaskAsNotified(task.id);
    }
  } catch (err) {
    console.error('Task Notification Query Error:', err.message);
  }
}, 60 * 1000);

app.get('/taskmanager/tasks', verifyToken, async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.user.id);
    console.log('返回任務列表:', { userId: req.user.id, tasks });
    res.json(tasks || []);
  } catch (err) {
    console.error('取得任務失敗:', err.message);
    res.status(500).json({ success: false, error: '取得任務失敗' });
  }
});

app.post('/taskmanager/add', verifyToken, async (req, res) => {
  const { title, description, due_date } = req.body;
  console.log('收到任務新增請求:', { title, description, due_date });
  if (!title || !due_date) {
    return res.status(400).json({
      success: false,
      error: '請提供標題和到期時間'
    });
  }
  try {
    const parsedDate = moment(due_date, moment.ISO_8601, true);
    if (!parsedDate.isValid()) {
      console.error('無效的日期格式:', due_date);
      return res.status(400).json({
        success: false,
        error: '無效的日期時間格式'
      });
    }
    if (parsedDate.isBefore(moment())) {
      console.error('到期時間早於當前時間:', due_date);
      return res.status(400).json({
        success: false,
        error: '到期時間必須是未來時間'
      });
    }
    const normalizedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const taskId = await taskService.addTask(
      req.user.id,
      title.trim(),
      (description || '').trim(),
      normalizedDate
    );
    res.json({
      success: true,
      taskId
    });
  } catch (err) {
    console.error('創建任務錯誤:', err.message);
    res.status(400).json({
      success: false,
      error: err.message || '創建任務失敗'
    });
  }
});

app.put('/taskmanager/edit/:id', verifyToken, async (req, res) => {
  const { title, description, due_date } = req.body;
  console.log('收到任務編輯請求:', { id: req.params.id, title, description, due_date });
  try {
    const parsedDate = moment(due_date, moment.ISO_8601, true);
    if (!parsedDate.isValid()) {
      console.error('無效的日期格式:', due_date);
      return res.status(400).json({
        success: false,
        error: '無效的日期時間格式'
      });
    }
    if (parsedDate.isBefore(moment())) {
      console.error('到期時間早於當前時間:', due_date);
      return res.status(400).json({
        success: false,
        error: '到期時間必須是未來時間'
      });
    }
    await taskService.editTask(req.user.id, req.params.id, title, description, due_date);
    res.json({ success: true });
  } catch (err) {
    console.error('編輯任務錯誤:', err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/taskmanager/delete/:id', verifyToken, async (req, res) => {
  try {
    await taskService.deleteTask(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('刪除任務錯誤:', err.message);
    res.status(500).json({ success: false, error: '刪除任務失敗' });
  }
});

// 檔案管理路由
app.get('/filemanager', verifyToken, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.render('filemanager', { username: user ? user.username : '未知' });
  } catch (err) {
    console.error('載入檔案管理頁面錯誤:', err);
    res.redirect('/dashboard');
  }
});

app.get('/filemanager/files', verifyToken, async (req, res) => {
  try {
    const files = await fileService.getFiles(req.user.id);
    res.json(files);
  } catch (err) {
    console.error('取得檔案列表失敗:', err);
    res.status(500).json({ success: false, error: '取得檔案列表失敗' });
  }
});

app.post('/filemanager/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: '請選擇一個檔案' });
    }
    const { customName, description } = req.body;
    if (!customName) {
      return res.status(400).json({ success: false, error: '請提供檔案名稱' });
    }
    await fileService.saveFile(req.user.id, req.file.filename, req.file.originalname, customName, description || '');
    res.json({ success: true });
  } catch (err) {
    console.error('檔案上傳錯誤:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/filemanager/edit/:filename', verifyToken, async (req, res) => {
  try {
    const { customName, description } = req.body;
    if (!customName) {
      return res.status(400).json({ success: false, error: '請提供檔案名稱' });
    }
    await fileService.editFile(req.user.id, req.params.filename, customName, description || '');
    res.json({ success: true });
  } catch (err) {
    console.error('編輯檔案資訊錯誤:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/filemanager/delete/:filename', verifyToken, async (req, res) => {
  try {
    await fileService.deleteFile(req.user.id, req.params.filename);
    res.json({ success: true });
  } catch (err) {
    console.error('刪除檔案錯誤:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/logout', async (req, res) => {
  console.log('處理登出請求');
  await logActivity(req.user?.id, '用戶登出', `用戶ID ${req.user?.id} 登出`);
  res.clearCookie('token');
  res.redirect('/login');
});

app.use((err, req, res, next) => {
  console.error('Global Error:', err.message);
  res.status(500).json({ success: false, error: '伺服器內部錯誤' });
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
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


## init.sql

```sql
-- 初始化資料庫結構和預設數據
-- 適用於 internal_website 資料庫，確保與現有系統兼容

-- 創建用戶表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

-- 檢查並添加 role 欄位（若現有資料庫缺少）
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

-- 插入或更新預設管理員帳戶
-- 密碼：admin123（使用 bcrypt 加密）
INSERT INTO users (username, email, password, role) VALUES (
  'admin',
  'admin@mysandshome.com',
  '$2b$10$80gmxoIc6.GiczCNng3fseLqhTn28hOmwjLlFfVDYqpIFhqDGocOW', -- 密碼：admin123
  'admin'
) ON DUPLICATE KEY UPDATE
  password = '$2b$10$80gmxoIc6.GiczCNng3fseLqhTn28hOmwjLlFfVDYqpIFhqDGocOW',
  role = 'admin';

-- 創建生字庫表
CREATE TABLE IF NOT EXISTS wordlists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 創建生字表
CREATE TABLE IF NOT EXISTS words (
  id INT AUTO_INCREMENT PRIMARY KEY,
  wordlist_id INT NOT NULL,
  english VARCHAR(255) NOT NULL,
  chinese VARCHAR(255) NOT NULL,
  FOREIGN KEY (wordlist_id) REFERENCES wordlists(id) ON DELETE CASCADE
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
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 創建檔案表
CREATE TABLE IF NOT EXISTS files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  custom_name VARCHAR(255) NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 創建推送訂閱表
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subscription JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 創建站點設定表
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(255) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 初始化站點設定（SEO 和系統設定）
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES
('site_title', '技術人員內部網站'),
('vapid_public_key', 'BCUBSpo6Y0Q8QUKduPAWXSwcvlElJbg5_PZDiXYJf1JC8sS3lCODMs_IiFDahD0LtlimMBqZj1G7lH61eVJMGeY'),
('index_meta_description', '技術人員內部網站，提供英文生字背默、任務管理和檔案管理功能，助力技術人員高效學習和工作。'),
('index_meta_keywords', '技術人員, 英文學習, 生字背默, 任務管理, 檔案管理, PWA應用'),
('index_og_title', '技術人員內部網站 - 高效學習與管理平台'),
('index_og_description', '專為技術人員設計的學習與管理工具，支持英文生字背默、任務管理和檔案管理，提升工作效率。'),
('login_meta_description', '登入技術人員內部網站，管理您的學習和工作任務。'),
('login_meta_keywords', '技術人員, 登入, 學習管理, 任務管理'),
('login_og_title', '技術人員內部網站 - 登入'),
('login_og_description', '登入技術人員內部網站，開始管理您的學習和工作任務。'),
('register_meta_description', '註冊技術人員內部網站，體驗高效的學習與管理工具。'),
('register_meta_keywords', '技術人員, 註冊, 學習管理, PWA應用'),
('register_og_title', '技術人員內部網站 - 註冊'),
('register_og_description', '立即註冊技術人員內部網站，體驗高效的學習與管理工具。');

-- 創建活動日誌表
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 檢查並添加 tasks 表的 notified 欄位
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

-- 初始化現有任務的 notified 狀態
UPDATE tasks SET notified = TRUE WHERE due_date < NOW();

-- 檢查並添加 files 表的 custom_name 和 description 欄位
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

-- 為現有檔案設置預設 custom_name（使用 original_name）
UPDATE files SET custom_name = original_name WHERE custom_name IS NULL OR custom_name = '';
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
    "bcryptjs": "^3.0.2",
    "body-parser": "^2.2.0",
    "bootstrap": "^5.3.8",
    "cookie-parser": "^1.4.7",
    "dotenv": "^17.2.3",
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "moment-timezone": "^0.6.0",
    "multer": "^2.0.2",
    "mysql2": "^3.15.1",
    "web-push": "^3.6.7"
  }
}
```

