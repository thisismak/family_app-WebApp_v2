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