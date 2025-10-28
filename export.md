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
  <div class="text-center mt-3">
    <a href="/dictation" class="btn btn-primary">背默英文生字</a>
    <a href="/taskmanager" class="btn btn-primary">任務管理</a>
    <a href="/filemanager" class="btn btn-primary">檔案管理</a>
    <a href="/notebook" class="btn btn-primary">筆記本</a> <!-- 新增這行 -->
    <% if (role==='admin' ) { %>
      <a href="/admin" class="btn btn-primary">後台管理</a>
      <% } %>
        <a href="/logout" class="btn btn-secondary">登出</a>
  </div>
  </div>
</body>
</html>
```

## views/dictation.ejs

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

    <!-- 返回儀表板按鈕 -->
    <div class="text-center mt-3">
      <a href="/dashboard" class="btn btn-secondary">返回儀表板</a>
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

## views/filemanager.ejs

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
</head>
<body>
  <div class="container mt-5 filemanager">
    <h2 class="text-center mb-5">檔案管理</h2>
    
    <!-- 檔案上傳區域 -->
    <div class="card p-4 mb-4">
      <h3 class="text-info">上傳檔案</h3>
      <form id="fileUploadForm" enctype="multipart/form-data">
        <div class="mb-3">
          <label for="customName" class="form-label text-info">檔案名稱</label>
          <input type="text" id="customName" name="customName" class="form-control" placeholder="輸入自訂檔案名稱" required>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label text-info">檔案描述</label>
          <textarea id="description" name="description" class="form-control" placeholder="輸入檔案描述（可選）" rows="3"></textarea>
        </div>
        <div class="mb-3">
          <label for="fileInput" class="form-label text-info">選擇檔案</label>
          <input type="file" id="fileInput" name="file" class="form-control file-input" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">上傳</button>
      </form>
    </div>

    <!-- 檔案列表區域 -->
    <div class="mt-4">
      <h3 class="text-info">檔案列表</h3>
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
                <label for="editCustomName" class="form-label text-info">檔案名稱</label>
                <input type="text" id="editCustomName" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="editDescription" class="form-label text-info">檔案描述</label>
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

    <div class="text-center mt-4">
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
                <a href="/uploads/${file.filename}" target="_blank" class="text-info">${file.custom_name || file.original_name}</a>
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

