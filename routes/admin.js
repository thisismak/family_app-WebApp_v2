// routes/admin.js
const express = require('express');
const router = express.Router();
const { query } = require('../db');
const siteSettingsService = require('../services/siteSettingsService');
const userService = require('../services/userService');
const fileService = require('../services/fileService');
const noteService = require('../services/noteService');
const taskService = require('../services/taskService');
const moment = require('moment-timezone');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// 驗證 admin 權限
async function verifyAdmin(req, res, next) {
  try {
    const user = await userService.getUserById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).send('<h1>403 禁止存取</h1>');
    }
    next();
  } catch (err) {
    res.redirect('/login');
  }
}

// 儀表板
router.get('/', verifyAdmin, async (req, res) => {
  const [userCount, taskCount, fileCount, noteCount] = await Promise.all([
    query('SELECT COUNT(*) as count FROM users').then(r => r[0].count),
    query('SELECT COUNT(*) as count FROM tasks WHERE due_date > NOW()').then(r => r[0].count),
    query('SELECT COUNT(*) as count FROM files').then(r => r[0].count),
    query('SELECT COUNT(*) as count FROM notes').then(r => r[0].count)
  ]);
  res.render('admin/dashboard', {
    stats: [userCount, taskCount, fileCount, noteCount],
    username: req.user.username
  });
});

// 站點設定
router.get('/settings', verifyAdmin, async (req, res) => {
  const settings = await siteSettingsService.getAllSettings();
  res.render('admin/settings', { settings });
});

router.post('/settings', verifyAdmin, async (req, res) => {
  const { key, value } = req.body;
  if (!key) return res.status(400).json({ error: '缺少 key' });
  try {
    await siteSettingsService.updateSetting(key, value);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 使用者管理
router.get('/users', verifyAdmin, async (req, res) => {
  const users = await query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
  res.render('admin/users', { users });
});

// 檔案總管
router.get('/files', verifyAdmin, async (req, res) => {
  const files = await fileService.getAllFiles();
  res.render('admin/files', { files });
});

router.delete('/files/:filename', verifyAdmin, async (req, res) => {
  try {
    await fileService.deleteFileByFilename(req.params.filename);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 筆記總管
router.get('/notes', verifyAdmin, async (req, res) => {
  const notes = await noteService.getAllNotes();
  res.render('admin/notes', { notes });
});

// 任務總覽
router.get('/tasks', verifyAdmin, async (req, res) => {
  const tasks = await taskService.getAllTasks();
  res.render('admin/tasks', { tasks });
});

// 活動日誌
router.get('/logs', verifyAdmin, async (req, res) => {
  const logs = await query('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 100');
  res.render('admin/logs', { logs });
});

// 備份資料庫
router.get('/backup', verifyAdmin, async (req, res) => {
  const file = `backup_${moment().format('YYYYMMDD_HHmmss')}.sql`;
  const cmd = `mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${file}`;
  try {
    await execPromise(cmd);
    res.download(file, () => fs.unlink(file).catch(() => {}));
  } catch (err) {
    res.status(500).send('備份失敗：' + err.message);
  }
});

// 清除快取
router.post('/clear-cache', verifyAdmin, (req, res) => {
  global.cachedSettings = null;
  global.settingsLastLoaded = 0;
  res.json({ success: true, message: '快取已清除' });
});

module.exports = router;