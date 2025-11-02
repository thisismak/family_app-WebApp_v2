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