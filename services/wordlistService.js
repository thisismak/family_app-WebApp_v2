const { query } = require('../db');

async function getWordlists(userId) {
  return await query('SELECT id, name FROM wordlists WHERE user_id = ?', [userId]);
}

module.exports = {
  async createWordlist(userId, name, words = []) {
    // 防護：確保 words 為陣列
    if (!Array.isArray(words)) {
      console.warn('createWordlist: words is not an array, converting to empty array or attempting to coerce', words);
      words = [];
    }

    // 建立 wordlist
    const insertRes = await query('INSERT INTO wordlists (user_id, name) VALUES (?, ?)', [userId, name]);
    const wordlistId = insertRes?.insertId ?? (Array.isArray(insertRes) && insertRes[0]?.insertId) ?? null;
    if (!wordlistId) throw new Error('無法建立生字庫 (no insertId returned)');

    // 準備要插入的 word tuples
    const tuples = words.map(w => {
      // 支援多種輸入格式：{english, chinese} 或 ["English","中文"]
      let english = '', chinese = '';
      if (typeof w === 'string') {
        const parts = w.split(',').map(s => s.trim());
        english = parts[0] || '';
        chinese = parts[1] || '';
      } else if (Array.isArray(w)) {
        english = (w[0] || '').toString().trim();
        chinese = (w[1] || '').toString().trim();
      } else if (typeof w === 'object' && w !== null) {
        english = (w.english || w.English || '').toString().trim();
        chinese = (w.chinese || w.Chinese || '').toString().trim();
      }
      return [wordlistId, english, chinese];
    }).filter(t => t[1] && t[2]); // 去除不完整的項目

    if (tuples.length > 0) {
      // 使用 bulk insert，MySQL 的 driver 接受 VALUES ? 並傳入 [tuples]
      await query('INSERT INTO words (wordlist_id, english, chinese) VALUES ?', [tuples]);
    }

    return wordlistId;
  },
  async deleteWordlist(userId, wordlistId) {
    await query('DELETE FROM words WHERE wordlist_id = ?', [wordlistId]);
    await query('DELETE FROM wordlists WHERE id = ? AND user_id = ?', [wordlistId, userId]);
    console.log('生字庫刪除成功:', wordlistId);
  }
};