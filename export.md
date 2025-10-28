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
  index.ejs
  login.ejs
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


## public\css\style.css

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
Sitemap: https://www.mysandshome.com/sitemap.xml
```


## public\sitemap.xml

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
  <title>我們的家庭空間 - 儀表板</title>
</head>
<body>
  <div class="container mt-5">
    <h2 class="text-center">歡迎登入我們的家庭空間</h2>
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


## views\index.ejs

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


## views\sitemap.ejs

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

