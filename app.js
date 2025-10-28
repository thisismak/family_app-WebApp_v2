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

    // 統計資料
    const [userCount, taskCount, fileCount, noteCount] = await Promise.all([
      query('SELECT COUNT(*) as count FROM users').then(r => r[0].count),
      query('SELECT COUNT(*) as count FROM tasks WHERE due_date > NOW()').then(r => r[0].count),
      query('SELECT COUNT(*) as count FROM files').then(r => r[0].count),
      query('SELECT COUNT(*) as count FROM notes').then(r => r[0].count)
    ]);

    res.render('admin/dashboard', {
      username: user.username,
      stats: [userCount, taskCount, fileCount, noteCount]
    });
  } catch (err) {
    console.error('後台載入失敗:', err);
    res.status(500).send('後台載入失敗');
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