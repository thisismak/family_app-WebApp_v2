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

// 全局 res.locals 防護，確保 EJS 不會因 undefined 崩潰
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
      res.download(file, () => fs.unlink(file).catch(() => {}));
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

// Dashboard
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

// 生字背默
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
    return res.status(400).json({ success: false, error: '請提供生字庫名稱和有效的生字列表' });
  }
  try {
    const wordlistId = await wordlistService.createWordlist(req.user.id, wordlistName, words);
    res.json({ success: true, wordlistId });
  } catch (err) {
    res.status(500).json({ success: false, error: '儲存生字庫失敗' });
  }
});

// ==================== 任務管理 ====================
// 路由 1: 頁面載入
app.get('/taskmanager', verifyToken, async (req, res) => {
  try {
    const settings = await loadSiteSettings();
    const vapidKey = settings.vapid_public_key || process.env.VAPID_PUBLIC_KEY || '';
    const tasks = await taskService.getTasks(req.user.id) || [];  // 修正
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

// 路由 2: API 取得任務
app.get('/taskmanager/tasks', verifyToken, async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.user.id) || [];  // 修正
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/taskmanager/add', verifyToken, async (req, res) => {
  const { title, description, due_date } = req.body;
  try {
    const id = await taskService.createTask(req.user.id, title, description, due_date);
    res.json({ success: true, id });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/taskmanager/edit/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date } = req.body;
  try {
    await taskService.updateTask(id, req.user.id, title, description, due_date);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/taskmanager/delete/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await taskService.deleteTask(id, req.user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==================== 檔案管理 ====================
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
    await fileService.updateFile(filename, req.user.id, customName, description);
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

// ==================== 記事本 ====================
app.get('/notebook', verifyToken, async (req, res) => {
  try {
    const settings = await loadSiteSettings();
    const notes = await noteService.getNotes(req.user.id) || [];
    const tags = await noteService.getTags(req.user.id) || [];

    res.render('notebook', {
      siteSettings: settings,
      notes: notes,        // 改：直接傳陣列
      tags: tags,          // 改：直接傳陣列
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

// ==================== 記事本 API ====================
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
    await noteService.updateNote(id, req.user.id, title, content, tags);
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
    await noteService.deleteNote(id, req.user.id);
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

// 推送訂閱
app.post('/subscribe', verifyToken, async (req, res) => {
  const subscription = req.body;
  try {
    await subscriptionService.saveSubscription(req.user.id, subscription);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 登出
app.get('/logout', async (req, res) => {
  await logActivity(req.user?.id, '用戶登出', `用戶ID: ${req.user?.id}`, req);
  res.clearCookie('token');
  res.redirect('/login');
});

// ==================== 全局錯誤處理 ====================

app.use((err, req, res, next) => {
  console.error('未處理錯誤:', err);
  logActivity(req.user?.id, '系統錯誤', err.message, req).catch(() => {});
  res.status(500).render('error', { message: '伺服器錯誤', error: err.message });
});

app.use((req, res) => {
  res.status(404).render('error', { message: '頁面不存在', error: null });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});