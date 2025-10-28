# Project Structure

```
public/
  css/
    notebook.css
    style.css
  images/
    family-logo-192x192.png
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
  noteService.js
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
  notebook.ejs
  register.ejs
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
```



# Selected Files Content

## public/css/notebook.css

```css
/* public/css/notebook.css */
/* 只放筆記本專屬樣式，避免污染全站 */

/* 筆記網格 */
#notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.note-card {
  background: var(--text-light);
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  border-left: 4px solid #ddd;
}

.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.note-card.pinned {
  border-left: 4px solid #f59e0b;
  background: #fffbeb;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.note-header h3 {
  margin: 0;
  font-size: 1.1em;
  color: var(--text-dark);
}

.pin-btn {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  color: var(--dark-pink);
}

.note-preview {
  color: #4b5563;
  font-size: 0.9em;
  margin: 8px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 8px 0;
}

.note-tags .tag {
  padding: 2px 8px;
  border-radius: 12px;
  color: white;
  font-size: 0.75em;
}

.note-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.note-actions button {
  flex: 1;
  padding: 6px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85em;
  font-weight: 600;
}

.note-actions button:nth-child(1) { background: var(--primary-pink); color: var(--text-dark); }
.note-actions button:nth-child(2) { background: #3b82f6; color: white; }
.note-actions button:nth-child(3) { background: #ef4444; color: white; }

/* Modal */
.modal {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal.show { display: flex; }

.modal-content {
  background: white;
  width: 90%;
  max-width: 700px;
  border-radius: 12px;
  padding: 20px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow);
}

#note-title {
  width: 100%;
  padding: 12px;
  font-size: 1.2em;
  border: 1px solid var(--dark-pink);
  border-radius: 8px;
  margin-bottom: 12px;
  font-family: var(--family-font);
}

.editor-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 12px;
}

.tab {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 600;
}

.tab.active {
  border-bottom: 2px solid var(--dark-pink);
  color: var(--dark-pink);
}

#note-content, #preview {
  width: 100%;
  min-height: 300px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: monospace;
  font-size: 1em;
}

#preview {
  background: #f9fafb;
  display: none;
  line-height: 1.6;
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
  align-items: center;
}

#tag-input {
  flex: 1;
  min-width: 120px;
  padding: 8px;
  border: 1px solid var(--dark-pink);
  border-radius: 6px;
}

#tag-list .tag {
  background: var(--primary-pink);
  color: var(--text-dark);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8em;
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-family: var(--family-font);
}

#save-note { background: #10b981; color: white; }
#cancel-edit { background: #6b7280; color: white; }
#share-note { background: #3b82f6; color: white; }

/* 響應式 */
@media (max-width: 768px) {
  #notes-grid {
    grid-template-columns: 1fr;
  }
  .modal-content {
    width: 95%;
    padding: 15px;
  }
}
```

## public/css/style.css

```css
/* 引入 Poppins 字體，作為家庭友好風格的主要字體 */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

/* 定義主題變量，適應家庭網站的柔和粉色調 */
:root {
  --primary-pink: #FFC1CC; /* 柔和粉色，用於按鈕和高亮 */
  --light-pink: #FFE4E1; /* 背景和卡片底色 */
  --dark-pink: #FF8A9B; /* 工具列和重點強調 */
  --text-dark: #333333; /* 主要文字顏色 */
  --text-light: #FFFFFF; /* 深色背景上的文字 */
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 柔和陰影 */
  --family-font: 'Poppins', sans-serif; /* 家庭友好字體 */
}

/* 全局樣式 */
body {
  font-family: var(--family-font);
  background: linear-gradient(135deg, var(--light-pink) 0%, #F8E6E9 50%, var(--light-pink) 100%);
  color: var(--text-dark);
  min-height: 100vh;
  margin: 0;
}

/* 主容器 */
.container {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow);
  max-width: 800px;
  margin: 20px auto;
}

/* 主要按鈕 */
.btn-primary {
  background: var(--primary-pink);
  color: var(--text-dark);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 10px 16px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: var(--dark-pink);
  color: var(--text-light);
  box-shadow: var(--shadow);
}

/* 次要按鈕 */
.btn-secondary {
  background: #E0E0E0;
  color: var(--text-dark);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 10px 16px;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--dark-pink);
  color: var(--text-light);
  box-shadow: var(--shadow);
}

/* 警告按鈕 */
.btn-danger {
  background: #FF6B6B;
  color: var(--text-light);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background: #FF4040;
  box-shadow: var(--shadow);
}

/* 資訊文字 */
.text-info {
  color: var(--dark-pink) !important;
}

/* 警告提示框 */
.alert-danger {
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid #FF6B6B;
  color: var(--text-dark);
  border-radius: 8px;
  padding: 15px;
}

/* 卡片樣式 */
.card {
  background: var(--text-light);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}

/* 表格樣式 */
.table-dark {
  background: rgba(255, 255, 255, 0.95);
  color: var(--text-dark);
  border-radius: 8px;
}

/* 模態框 */
.modal-content {
  background: var(--light-pink);
  color: var(--text-dark);
  border-radius: 12px;
}

/* 導航欄 */
.navbar {
  background: var(--dark-pink) !important;
  border-radius: 0 0 12px 12px;
  box-shadow: var(--shadow);
}

.navbar-brand, .nav-link {
  color: var(--primary-pink) !important; /* 導航欄文字改為粉紅色 */
  font-weight: 600;
}

.nav-link:hover {
  color: var(--dark-pink) !important; /* 懸停時使用深粉色，與 .text-info 一致 */
}

/* 家庭標誌 */
.family-logo {
  display: block;
  margin: 16px auto;
  width: 100px;
  height: auto;
}

/* 歡迎訊息區塊 */
.welcome-message {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, var(--primary-pink), var(--light-pink));
  border-radius: 12px;
  margin: 16px;
  color: var(--text-dark);
  box-shadow: var(--shadow);
}

/* 列表樣式 */
.list-group-item {
  background: var(--text-light);
  color: var(--text-dark);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 8px;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, background 0.3s ease;
}

.list-group-item:hover {
  background: var(--light-pink);
  transform: translateY(-4px);
}

/* 表單元素 */
.form-control {
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  color: var(--text-dark);
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

/* 任務管理頁面的輸入欄 */
.taskmanager .form-control {
  border: 1px solid var(--dark-pink);
  background: var(--text-light);
  box-shadow: 0 0 8px rgba(255, 138, 155, 0.5);
}

.taskmanager .form-control:focus {
  border: 2px solid var(--dark-pink);
  box-shadow: 0 0 10px rgba(255, 138, 155, 0.7);
}

/* 任務管理的文字輸入欄 */
.taskmanager .text-input {
  border: 2px solid var(--dark-pink);
  box-shadow: 0 0 10px rgba(255, 138, 155, 0.7);
}

.taskmanager .text-input:focus {
  border: 2px solid var(--dark-pink);
  box-shadow: 0 0 12px rgba(255, 138, 155, 0.8);
}

/* 檔案管理頁面的輸入欄 */
.filemanager .form-control {
  border: 1px solid var(--dark-pink);
  background: var(--text-light);
  box-shadow: 0 0 8px rgba(255, 138, 155, 0.5);
}

.filemanager .form-control:focus {
  border: 2px solid var(--dark-pink);
  box-shadow: 0 0 10px rgba(255, 138, 155, 0.7);
}

/* 檔案管理的文件輸入欄 */
.filemanager .file-input {
  border: 2px solid var(--dark-pink);
  box-shadow: 0 0 10px rgba(255, 138, 155, 0.7);
}

.filemanager .file-input:focus {
  border: 2px solid var(--dark-pink);
  box-shadow: 0 0 12px rgba(255, 138, 155, 0.8);
}

/* 登入頁面的文字輸入欄 */
.login .text-input {
  border: 2px solid var(--dark-pink);
  box-shadow: 0 0 10px rgba(255, 138, 155, 0.7);
}

.login .text-input:focus {
  border: 2px solid var(--dark-pink);
  box-shadow: 0 0 12px rgba(255, 138, 155, 0.8);
}

/* 註冊頁面的文字輸入欄 */
.register .text-input {
  border: 2px solid var(--dark-pink);
  box-shadow: 0 0 10px rgba(255, 138, 155, 0.7);
}

.register .text-input:focus {
  border: 2px solid var(--dark-pink);
  box-shadow: 0 0 12px rgba(255, 138, 155, 0.8);
}

/* 任務日曆 */
.fc {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow);
}

.fc .fc-daygrid-day {
  background: var(--text-light);
  border-radius: 8px;
  transition: transform 0.3s ease, background 0.3s ease;
}

.fc .fc-daygrid-day:hover {
  background: var(--light-pink);
  transform: scale(1.02);
  box-shadow: var(--shadow);
}

.fc .fc-event {
  background: var(--primary-pink) !important;
  border: 2px solid var(--dark-pink) !important;
  color: var(--text-dark) !important;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 4px 8px;
}

/* 任務管理標題 */
.taskmanager h2 {
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 檔案管理標題 */
.filemanager h2, .filemanager h3 {
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 筆記本頁面 */
.notebook .form-control {
  border: 1px solid var(--dark-pink);
  background: var(--text-light);
}
.notebook .form-control:focus {
  border: 2px solid var(--dark-pink);
  box-shadow: 0 0 10px rgba(255, 138, 155, 0.7);
}

/* 登入頁面標題 */
.login h2 {
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 註冊頁面標題 */
.register h2 {
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 檔案管理縮略圖 */
.thumbnail {
  max-width: 50px;
  max-height: 50px;
  margin-right: 10px;
  vertical-align: middle;
  border-radius: 8px;
  box-shadow: var(--shadow);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .container {
    padding: 15px;
    max-width: 95%;
  }

  .btn-primary, .btn-secondary, .btn-danger {
    padding: 8px 12px;
    font-size: 14px;
  }

  .welcome-message {
    padding: 16px;
    margin: 10px;
  }

  .card {
    max-width: 90%;
  }

  .navbar-brand, .nav-link {
    font-size: 14px;
  }

  .family-logo {
    width: 80px;
  }

  .list-group-item {
    padding: 1rem;
  }

  .fc {
    padding: 15px;
    max-width: 95%;
  }

  .fc .fc-event {
    padding: 2px 4px;
    font-size: 0.8em;
  }

  .thumbnail {
    max-width: 40px;
    max-height: 40px;
  }

  .taskmanager .text-input,
  .filemanager .file-input,
  .login .text-input,
  .register .text-input {
    font-size: 0.9em;
  }
}

/* PWA 離線頁面 */
body.offline {
  background: var(--light-pink);
}

body.offline .container {
  background: var(--text-light);
  color: var(--text-dark);
}
```

## public/js/notebook.js

```js
let currentNoteId = null;
let notes = [];

// 載入筆記
async function loadNotes() {
  const search = document.getElementById('search').value;
  const tag = document.getElementById('tag-filter').value;
  const sort = document.getElementById('sort').value;

  const res = await fetch(`/notebook/notes?search=${encodeURIComponent(search)}&tag=${tag}&sort=${sort}`);
  notes = await res.json();
  renderNotes();
}

// 渲染筆記卡片
function renderNotes() {
  const grid = document.getElementById('notes-grid');
  grid.innerHTML = notes.map(note => `
    <div class="note-card ${note.is_pinned ? 'pinned' : ''}" style="border-left: 4px solid ${note.color || '#ddd'}">
      <div class="note-header">
        <h3>${escapeHtml(note.title)}</h3>
        <button class="pin-btn" data-id="${note.id}">${note.is_pinned ? 'Unpin' : 'Pin'}</button>
      </div>
      <div class="note-preview">${marked.parse(note.content || '').replace(/<[^>]*>/g, '').slice(0, 100)}...</div>
      <div class="note-tags">
        ${note.tags.map((tag, i) => `<span class="tag" style="background:${note.tag_colors[i]}">${tag}</span>`).join('')}
      </div>
      <div class="note-actions">
        <button onclick="editNote(${note.id})">編輯</button>
        <button onclick="shareNote(${note.id})">分享</button>
        <button class="delete" onclick="deleteNote(${note.id})">刪除</button>
      </div>
      <small>${new Date(note.updated_at).toLocaleString()}</small>
    </div>
  `).join('');
}

// 編輯筆記
async function editNote(id) {
  const note = notes.find(n => n.id === id) || { title: '', content: '', tags: [] };
  currentNoteId = id;
  document.getElementById('note-title').value = note.title || '';
  document.getElementById('note-content').value = note.content || '';
  document.getElementById('share-note').style.display = id ? 'inline-block' : 'none';
  renderTags(note.tags || []);
  showTab('write');
  document.getElementById('editor-modal').classList.add('show');
}

// 儲存
document.getElementById('save-note').onclick = async () => {
  const title = document.getElementById('note-title').value.trim();
  const content = document.getElementById('note-content').value;
  const tags = Array.from(document.querySelectorAll('#tag-list .tag')).map(t => t.textContent);

  if (!title) return alert('請輸入標題');

  const url = currentNoteId ? `/notebook/edit/${currentNoteId}` : '/notebook/add';
  const method = currentNoteId ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, tags })
  });

  closeModal();
  loadNotes();
};

// 標籤輸入
document.getElementById('tag-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.value.trim()) {
    addTag(e.target.value.trim());
    e.target.value = '';
  }
});

function addTag(name) {
  const list = document.getElementById('tag-list');
  if (!list.querySelector(`.tag:contains(${name})`)) {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = name;
    span.onclick = () => span.remove();
    list.appendChild(span);
  }
}

function renderTags(tags) {
  const list = document.getElementById('tag-list');
  list.innerHTML = tags.map(t => `<span class="tag" onclick="this.remove()">${t}</span>`).join('');
}

// 分享
async function shareNote(id) {
  const res = await fetch(`/notebook/share/${id}`, { method: 'POST' });
  const data = await res.json();
  if (data.success) {
    prompt('分享連結（24小時有效）：', data.url);
  }
}

// 置頂 / 刪除
async function togglePin(id) {
  await fetch(`/notebook/pin/${id}`, { method: 'POST' });
  loadNotes();
}

async function deleteNote(id) {
  if (confirm('確定刪除？')) {
    await fetch(`/notebook/delete/${id}`, { method: 'DELETE' });
    loadNotes();
  }
}

// Markdown 預覽
document.querySelectorAll('.tab').forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    showTab(tab.dataset.tab);
  };
});

function showTab(tab) {
  const content = document.getElementById('note-content').value;
  document.getElementById('preview').innerHTML = marked.parse(content);
  document.getElementById('note-content').style.display = tab === 'write' ? 'block' : 'none';
  document.getElementById('preview').style.display = tab === 'preview' ? 'block' : 'none';
}

// 初始化
document.getElementById('new-note').onclick = () => editNote(null);
document.getElementById('cancel-edit').onclick = closeModal;
document.getElementById('search').oninput = debounce(loadNotes, 300);
document.getElementById('tag-filter').onchange = loadNotes;
document.getElementById('sort').onchange = loadNotes;

function closeModal() {
  document.getElementById('editor-modal').classList.remove('show');
  currentNoteId = null;
}

function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 綁定事件
document.addEventListener('click', e => {
  if (e.target.classList.contains('pin-btn')) {
    togglePin(e.target.dataset.id);
  }
});

// 載入
loadNotes();
```

## public/js/taskmanager.js

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

## views/index.ejs

```ejs
<!DOCTYPE html>
<html lang="zh-HK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- SEO 元標籤 -->
  <meta name="description" content="我們的家庭空間 - 一個專為家庭成員設計的溫馨平台，管理任務、學習生字、分享檔案，增進家庭互動！">
  <meta name="keywords" content="家庭網站, 任務管理, 生字學習, 檔案分享, 家庭互動">
  <meta name="robots" content="index, follow">
  <!-- 網站標題 -->
  <title>我們的家庭空間 - 溫馨管理與分享平台</title>
  <!-- Open Graph 標籤 -->
  <meta property="og:title" content="我們的家庭空間">
  <meta property="og:description" content="一個專為家庭成員設計的溫馨平台，管理任務、學習生字、分享檔案，增進家庭互動！">
  <meta property="og:url" content="https://www.mysandshome.com">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://www.mysandshome.com/images/family-logo-512x512.png">
  <!-- 網站地圖 -->
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <!-- PWA 相關 -->
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" href="/images/family-logo-192x192.png">
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- 自定義樣式 -->
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <!-- 導航欄 -->
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container">
      <a class="navbar-brand" href="/">我們的家庭空間</a>
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
    <div class="container welcome-message">
      <img src="/images/family-logo-192x192.png" alt="Family Logo" class="family-logo">
      <h1 class="display-4 fw-bold mb-4">歡迎來到我們的家庭空間</h1>
      <p class="lead mb-4">一個專為家庭成員打造的溫馨平台，讓我們一起管理任務、學習生字、分享美好時刻！</p>
      <a href="/register" class="btn btn-primary btn-lg">加入我們的家庭</a>
    </div>
  </section>

  <!-- 功能區塊 -->
  <section id="features" class="py-5">
    <div class="container">
      <h2 class="text-center mb-5">家庭共享功能</h2>
      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card p-4">
            <h3 class="text-info">生字學習</h3>
            <p>為孩子和家人創建專屬的英文生字庫，輕鬆學習和複習，增進語言能力。</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card p-4">
            <h3 class="text-info">家庭任務</h3>
            <p>使用日曆和任務清單管理家庭活動和待辦事項，讓每個人都能參與！</p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card p-4">
            <h3 class="text-info">檔案分享</h3>
            <p>安全上傳和分享家庭照片、文件或學習資料，隨時回顧美好時刻。</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 關於區塊 -->
  <section id="about" class="py-5">
    <div class="container">
      <h2 class="text-center mb-5">關於我們的家庭空間</h2>
      <p class="text-center">我們的家庭空間是一個專為家庭成員設計的平台，幫助您管理日常任務、學習新知識並分享快樂時光。結合 PWA 技術，支持離線使用，讓家庭聯繫更加緊密！</p>
    </div>
  </section>

  <!-- 聯繫區塊 -->
  <section id="contact" class="py-5">
    <div class="container">
      <h2 class="text-center mb-5">聯繫我們</h2>
      <p class="text-center">有任何問題或建議？請隨時聯繫我們！</p>
      <ul class="list-unstyled text-center">
        <li><a href="mailto:support@mysandshome.com" class="text-decoration-none text-info">Email: support@mysandshome.com</a></li>
        <li><a href="https://github.com/thisismak" class="text-decoration-none text-info">GitHub: thisismak</a></li>
      </ul>
    </div>
  </section>

  <!-- 頁尾 -->
  <footer class="text-center py-3">
    <p>&copy; 2025 我們的家庭空間. All Rights Reserved.</p>
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

## views/login.ejs

```ejs
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/style.css" rel="stylesheet">
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
        <input type="text" id="username" name="username" class="form-control text-input" placeholder="輸入用戶名" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label text-info">密碼</label>
        <input type="password" id="password" name="password" class="form-control text-input" placeholder="輸入密碼" required>
      </div>
      <button type="submit" class="btn btn-primary w-100">登入</button>
    </form>
    <div class="text-center mt-4">
      <p>還沒有帳號？ <a href="/register" class="text-info">立即註冊</a></p>
    </div>
  </div>
</body>
</html>
```

## views/notebook.ejs

```ejs
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>筆記本 - <%= siteSettings.site_title %></title>
  <!-- 1. 先載入全站共用樣式（包含主題變數） -->
  <link rel="stylesheet" href="/css/style.css" />
  <!-- 2. 再載入筆記本專用樣式（可覆蓋 style.css） -->
  <link rel="stylesheet" href="/css/notebook.css" />

  <link rel="manifest" href="/manifest.json" />
</head>
<body>
  <div class="container">
    <header>
      <h1>筆記本</h1>
      <button id="new-note">新增筆記</button>
    </header>

    <div class="controls">
      <input type="text" id="search" placeholder="搜尋筆記..." />
      <select id="tag-filter">
        <option value="">所有標籤</option>
        <% tags.forEach(t => { %>
          <option value="<%= t.id %>"><%= t.name %></option>
        <% }) %>
      </select>
      <select id="sort">
        <option value="updated">最近修改</option>
        <option value="title">標題排序</option>
        <option value="created">建立時間</option>
      </select>
    </div>

    <div id="notes-grid"></div>

    <!-- ★★ 新增：返回儀表板按鈕 ★★ -->
    <div class="text-center mt-4">
      <a href="/dashboard" class="btn btn-secondary">返回儀表板</a>
    </div>
  </div>

  <!-- 編輯器 Modal -->
  <div id="editor-modal" class="modal">
    <div class="modal-content">
      <input type="text" id="note-title" placeholder="筆記標題" />
      <div class="editor-tabs">
        <button class="tab active" data-tab="write">編輯</button>
        <button class="tab" data-tab="preview">預覽</button>
      </div>
      <textarea id="note-content"></textarea>
      <div id="preview" class="markdown"></div>
      <div class="tags-input">
        <input type="text" id="tag-input" placeholder="[選填]輸入標籤，按 Enter" />
        <div id="tag-list"></div>
      </div>
      <div class="actions">
        <button id="save-note">儲存</button>
        <button id="cancel-edit">取消</button>
        <button id="share-note" style="display:none">分享</button>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="/js/notebook.js"></script>
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

## views/taskmanager.ejs

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
  <div class="container mt-5 taskmanager">
    <h2 class="text-center mb-5">任務管理</h2>
    <form id="taskForm" class="card p-4 mb-4">
      <input type="hidden" id="taskId">
      <div class="mb-3">
        <label for="title" class="form-label text-info">任務標題</label>
        <input type="text" id="title" class="form-control text-input" required>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label text-info">任務描述</label>
        <textarea id="description" class="form-control text-input" rows="3"></textarea>
      </div>
      <div class="mb-3">
        <label for="dueDate" class="form-label text-info">到期日期</label>
        <input type="date" id="dueDate" class="form-control" required>
      </div>
      <div class="mb-3">
        <label for="dueTime" class="form-label text-info">到期時間</label>
        <input type="time" id="dueTime" class="form-control" required>
      </div>
      <button type="button" onclick="saveTask()" class="btn btn-primary">儲存任務</button>
    </form>
    <div class="mt-4">
      <h2 class="text-center mb-5">任務清單</h2>
      <ul id="taskList" class="list-group"></ul>
    </div>
    <div class="mt-4">
      <h2 class="text-center mb-5">任務日曆</h2>
      <div id="calendar" class="card p-4"></div>
    </div>
    <div class="text-center mt-4">
      <a href="/dashboard" class="btn btn-secondary">返回儀表板</a>
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
const noteService = require('./services/noteService'); // 完整筆記服務
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

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

// 管理員驗證
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (user.role !== 'admin') {
      await logActivity(req.user.id, '權限拒絕', `試圖訪問管理頁面: ${req.originalUrl}`, req);
      return res.status(403).json({ success: false, error: '無管理員權限' });
    }
    next();
  } catch (err) {
    console.error('管理員驗證失敗:', err.message);
    res.redirect('/login');
  }
};

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
const verifyToken = async (req, res, next) => {
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

// ==================== 公開路由 ====================

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

// ==================== 登入後路由 ====================

// Dashboard
app.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    await logActivity(req.user.id, '訪問儀表板', '進入 Dashboard', req);
    res.render('dashboard', {
      username: user.username,
      role: user.role
    });
  } catch (err) {
    console.error('載入 dashboard 錯誤:', err.message);
    res.redirect('/login');
  }
});

// 生字背默（保持不變）
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

// 任務管理（保持不變）
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
        } catch (err) {
          console.error('Push 發送失敗:', err.message);
        }
      }
      await taskService.markTaskAsNotified(task.id);
    }
  } catch (err) {
    console.error('任務提醒錯誤:', err.message);
  }
}, 60 * 1000);

app.get('/taskmanager/tasks', verifyToken, async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.user.id);
    res.json(tasks || []);
  } catch (err) {
    res.status(500).json({ success: false, error: '取得任務失敗' });
  }
});

app.post('/taskmanager/add', verifyToken, async (req, res) => {
  const { title, description, due_date } = req.body;
  if (!title || !due_date) {
    return res.status(400).json({ success: false, error: '請提供標題和到期時間' });
  }
  try {
    const parsedDate = moment(due_date, moment.ISO_8601, true);
    if (!parsedDate.isValid() || parsedDate.isBefore(moment())) {
      return res.status(400).json({ success: false, error: '無效或過期的日期' });
    }
    const taskId = await taskService.addTask(req.user.id, title.trim(), (description || '').trim(), parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'));
    res.json({ success: true, taskId });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/taskmanager/edit/:id', verifyToken, async (req, res) => {
  const { title, description, due_date } = req.body;
  try {
    const parsedDate = moment(due_date, moment.ISO_8601, true);
    if (!parsedDate.isValid() || parsedDate.isBefore(moment())) {
      return res.status(400).json({ success: false, error: '無效或過期的日期' });
    }
    await taskService.editTask(req.user.id, req.params.id, title, description, due_date);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/taskmanager/delete/:id', verifyToken, async (req, res) => {
  try {
    await taskService.deleteTask(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: '刪除任務失敗' });
  }
});

// 檔案管理（保持不變）
app.get('/filemanager', verifyToken, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.render('filemanager', { username: user.username });
  } catch (err) {
    res.redirect('/dashboard');
  }
});

app.get('/filemanager/files', verifyToken, async (req, res) => {
  try {
    const files = await fileService.getFiles(req.user.id);
    res.json(files);
  } catch (err) {
    res.status(500).json({ success: false, error: '取得檔案失敗' });
  }
});

app.post('/filemanager/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: '請選擇檔案' });
    const { customName, description } = req.body;
    if (!customName) return res.status(400).json({ success: false, error: '請提供檔案名稱' });
    await fileService.saveFile(req.user.id, req.file.filename, req.file.originalname, customName, description || '');
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/filemanager/edit/:filename', verifyToken, async (req, res) => {
  try {
    const { customName, description } = req.body;
    if (!customName) return res.status(400).json({ success: false, error: '請提供檔案名稱' });
    await fileService.editFile(req.user.id, req.params.filename, customName, description || '');
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/filemanager/delete/:filename', verifyToken, async (req, res) => {
  try {
    await fileService.deleteFile(req.user.id, req.params.filename);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== 筆記本（專業版）================

// 載入筆記本 + 標籤
app.get('/notebook', verifyToken, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    const tags = await noteService.getTags(req.user.id);
    const siteSettings = await loadSiteSettings(); // 新增這行
    res.render('notebook', { 
      username: user.username, 
      tags,
      siteSettings // 傳入
    });
  } catch (err) {
    console.error('載入 notebook 失敗:', err);
    res.redirect('/dashboard');
  }
});

// 取得筆記（支援搜尋、標籤、排序）
app.get('/notebook/notes', verifyToken, async (req, res) => {
  const { search = '', tag = null, sort = 'updated' } = req.query;
  try {
    const notes = await noteService.getNotes(req.user.id, search, tag, sort);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 新增筆記
app.post('/notebook/add', verifyToken, async (req, res) => {
  const { title, content = '', tags = [] } = req.body;
  if (!title) return res.status(400).json({ success: false, error: '標題必填' });
  try {
    const noteId = await noteService.createNote(req.user.id, title, content, tags);
    res.json({ success: true, noteId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 編輯筆記
app.put('/notebook/edit/:id', verifyToken, async (req, res) => {
  const { title, content = '', tags = [] } = req.body;
  if (!title) return res.status(400).json({ success: false, error: '標題必填' });
  try {
    await noteService.updateNote(req.user.id, req.params.id, title, content, tags);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 刪除筆記
app.delete('/notebook/delete/:id', verifyToken, async (req, res) => {
  try {
    await noteService.deleteNote(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 置頂切換
app.post('/notebook/pin/:id', verifyToken, async (req, res) => {
  try {
    await noteService.togglePin(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 分享筆記（24小時）
app.post('/notebook/share/:id', verifyToken, async (req, res) => {
  try {
    const token = await noteService.createShareLink(req.params.id, 24);
    const url = `${req.protocol}://${req.get('host')}/share/${token}`;
    res.json({ success: true, url });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 唯讀分享頁面
app.get('/share/:token', async (req, res) => {
  try {
    const note = await noteService.getNoteByShareToken(req.params.token);
    if (!note) return res.status(404).render('error', { message: '連結無效或已過期' });
    res.render('share-note', { note });
  } catch (err) {
    res.status(500).render('error', { message: '載入失敗' });
  }
});

// ==================== 管理員後台 ====================

app.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    await logActivity(req.user.id, '訪問後台', '進入管理員儀表板', req);
    res.render('admin/dashboard', { username: user.username });
  } catch (err) {
    res.status(500).json({ success: false, error: '載入失敗' });
  }
});

// 登出
app.get('/logout', async (req, res) => {
  await logActivity(req.user?.id, '用戶登出', `用戶ID: ${req.user?.id}`, req);
  res.clearCookie('token');
  res.redirect('/login');
});

// 全局錯誤處理
app.use((err, req, res, next) => {
  console.error('未處理錯誤:', err);
  logActivity(req.user?.id, '系統錯誤', err.message, req).catch(() => {});
  res.status(500).json({ success: false, error: '伺服器錯誤' });
});

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

-- 初始化站點設定（家庭版）
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES
('site_title', '家庭內部網站'),
('vapid_public_key', 'BCUBSpo6Y0Q8QUKduPAWXSwcvlElJbg5_PZDiXYJf1JC8sS3lCODMs_IiFDahD0LtlimMBqZj1G7lH61eVJMGeY'),
('index_meta_description', '家庭內部網站，提供生字背默、任務管理、檔案管理與家庭筆記功能，協助家庭成員高效學習與生活。'),
('index_meta_keywords', '家庭, 學習, 任務, 檔案, 筆記, PWA'),
('index_og_title', '家庭內部網站 - 共享學習與生活平台'),
('index_og_description', '專為家庭設計的內部工具，支持生字背默、任務提醒、檔案共享與家庭筆記，提升家庭效率。'),
('login_meta_description', '登入家庭內部網站，管理您的學習與生活任務。'),
('login_meta_keywords', '家庭, 登入, 任務管理'),
('login_og_title', '家庭內部網站 - 登入'),
('login_og_description', '登入家庭內部網站，開始管理您的任務與筆記。'),
('register_meta_description', '註冊家庭內部網站，體驗高效的家庭管理工具。'),
('register_meta_keywords', '家庭, 註冊, 學習管理'),
('register_og_title', '家庭內部網站 - 註冊'),
('register_og_description', '立即註冊家庭內部網站，體驗高效的家庭管理工具。');

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
```

