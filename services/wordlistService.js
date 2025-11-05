const { query } = require('../db');

async function getWordlists(userId) {
  const results = await query('SELECT id, name, created_at FROM wordlists WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return results || [];
}

async function createWordlist(userId, name, words = []) {
  if (!name) throw new Error('缺少生字庫名稱');
  if (!Array.isArray(words)) words = [];

  const insertRes = await query('INSERT INTO wordlists (user_id, name) VALUES (?, ?)', [userId, name]);
  const wordlistId = insertRes?.insertId ?? (Array.isArray(insertRes) && insertRes[0]?.insertId) ?? null;
  if (!wordlistId) throw new Error('無法建立生字庫');

  // 準備 bulk insert 的 tuples
  const tuples = words.map(w => {
    let english = '', chinese = '';
    if (typeof w === 'string') {
      const parts = w.split(',').map(p => p.trim());
      english = parts[0] || '';
      chinese = parts[1] || '';
    } else if (Array.isArray(w)) {
      english = (w[0] || '').toString().trim();
      chinese = (w[1] || '').toString().trim();
    } else if (w && typeof w === 'object') {
      english = (w.english || w.English || '').toString().trim();
      chinese = (w.chinese || w.Chinese || '').toString().trim();
    }
    return [wordlistId, english, chinese];
  }).filter(t => t[1] && t[2]);

  if (tuples.length > 0) {
    // 使用 bulk insert（假設 db.query 支援 VALUES ?）
    await query('INSERT INTO words (wordlist_id, english, chinese) VALUES ?', [tuples]);
  }

  return wordlistId;
}

async function getWords(wordlistId) {
  const results = await query('SELECT id, english, chinese FROM words WHERE wordlist_id = ? ORDER BY id ASC', [wordlistId]);
  return results || [];
}

async function addWord(wordlistId, english, chinese) {
  if (!wordlistId || !english || !chinese) throw new Error('缺少參數');
  const res = await query('INSERT INTO words (wordlist_id, english, chinese) VALUES (?, ?, ?)', [wordlistId, english.trim(), chinese.trim()]);
  return res?.insertId ?? null;
}

async function updateWords(wordlistId, words = []) {
  if (!wordlistId) throw new Error('缺少 wordlistId');
  if (!Array.isArray(words)) throw new Error('words 必須為陣列');

  // 最簡單作法：刪除現有並重插（視需求可改為逐筆更新）
  await query('DELETE FROM words WHERE wordlist_id = ?', [wordlistId]);

  const tuples = words.map(w => {
    let english = '', chinese = '';
    if (typeof w === 'string') {
      const parts = w.split(',').map(p => p.trim());
      english = parts[0] || '';
      chinese = parts[1] || '';
    } else if (Array.isArray(w)) {
      english = (w[0] || '').toString().trim();
      chinese = (w[1] || '').toString().trim();
    } else if (w && typeof w === 'object') {
      english = (w.english || w.English || '').toString().trim();
      chinese = (w.chinese || w.Chinese || '').toString().trim();
    }
    return [wordlistId, english, chinese];
  }).filter(t => t[1] && t[2]);

  if (tuples.length > 0) {
    await query('INSERT INTO words (wordlist_id, english, chinese) VALUES ?', [tuples]);
  }

  return true;
}

async function deleteWordlist(wordlistId, userId = null) {
  if (!wordlistId) throw new Error('缺少 wordlistId');

  // 若傳入 userId，確保該 user 擁有此生字庫
  if (userId) {
    const wl = await query('SELECT id FROM wordlists WHERE id = ? AND user_id = ?', [wordlistId, userId]);
    if (!wl || wl.length === 0) throw new Error('找不到對應的生字庫或無權限');
  }

  await query('DELETE FROM words WHERE wordlist_id = ?', [wordlistId]);
  await query('DELETE FROM wordlists WHERE id = ?', [wordlistId]);
  return true;
}

module.exports = {
  getWordlists,
  createWordlist,
  getWords,
  addWord,
  updateWords,
  deleteWordlist
};