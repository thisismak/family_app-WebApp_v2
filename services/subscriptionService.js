const { query } = require('../db');

// services/subscriptionService.js

async function saveSubscription(userId, subscription) {
  if (!subscription || !subscription.endpoint) {
    console.error('無效的訂閱物件:', { userId, subscription });
    throw new Error('無效的推送訂閱數據');
  }

  // 【刪除這整段檢查】不再跳過「已存在」
  // const existing = await query('SELECT * FROM push_subscriptions WHERE user_id = ? AND JSON_EXTRACT(subscription, "$.endpoint") = ?', [userId, subscription.endpoint]);
  // if (!Array.isArray(existing)) { ... }
  // if (existing.length > 0) { ... return; }

  // 直接插入（允許多設備）
  await query(
    'INSERT INTO push_subscriptions (user_id, subscription) VALUES (?, ?)',
    [userId, JSON.stringify(subscription)]
  );
  console.log('新設備訂閱已儲存:', userId, subscription.endpoint);
}

async function getSubscription(userId) {
  const results = await query('SELECT subscription FROM push_subscriptions WHERE user_id = ?', [userId]);
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('無訂閱記錄');
  }
  return JSON.parse(results[0].subscription);
}

module.exports = { saveSubscription, getSubscription };