# Project Structure

```
public/
  css/
    style.css
  images/
    family-logo-192x192.png
    icon-192x192.png
    icon-512x512.png
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
family-app.conf
init.sql
package.json
README.md
```



# Selected Files Content

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
  <meta property="og:url" content="https://tools.mysandshome.com">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://tools.mysandshome.com/images/family-logo-512x512.png">
  <!-- 網站地圖 -->
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <!-- PWA 相關 -->
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" href="/images/family-logo-192x192.png">
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- 自定義樣式 -->
  <link rel="stylesheet" href="/style.css">
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

