const { query } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function getUserById(id) {
  try {
    const results = await query('SELECT id, username, email, role FROM users WHERE id = ?', [id]);
    console.log('getUserById 查詢結果:', { id, results });
    if (!results || results.length === 0) {
      throw new Error('用戶不存在');
    }
    return results[0];
  } catch (err) {
    console.error('getUserById 錯誤:', { id, error: err.message, stack: err.stack });
    throw err;
  }
}

// 註冊時儲存 recovery_code 和 recovery_expires
async function registerUser(username, email, password, recoveryCode) {
  try {
    const results = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (Array.isArray(results) && results.length > 0) {
      throw new Error('電郵地址已被使用');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小時後過期
    await query(
      'INSERT INTO users (username, email, password, role, recovery_code, recovery_expires) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, 'user', recoveryCode.trim(), expires]
    );
    console.log('用戶註冊成功:', { username, email });
  } catch (err) {
    console.error('registerUser 錯誤:', err.message);
    throw err;
  }
}

// 根據 recovery_code 找用戶（並檢查是否過期）
async function getUserByRecoveryCode(code) {
  try {
    const results = await query(
      'SELECT * FROM users WHERE recovery_code = ? AND recovery_expires > NOW()',
      [code.trim()]
    );
    if (!results || results.length === 0) {
      throw new Error('恢復碼無效或已過期');
    }
    return results[0];
  } catch (err) {
    console.error('getUserByRecoveryCode 錯誤:', err.message);
    throw err;
  }
}

// 更新密碼 + 清除 recovery_code（安全）
async function updatePassword(userId, newPassword) {
  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await query(
      'UPDATE users SET password = ?, recovery_code = NULL, recovery_expires = NULL WHERE id = ?',
      [hashed, userId]
    );
    console.log('密碼更新成功:', { userId });
  } catch (err) {
    console.error('updatePassword 錯誤:', err.message);
    throw err;
  }
}

async function loginUser(username, password) {
  try {
    const results = await query('SELECT * FROM users WHERE username = ?', [username]);
    console.log('查詢結果:', results);
    if (!results || results.length === 0) {
      throw new Error('用戶名或密碼錯誤');
    }
    const user = results[0];
    if (!user || !user.password) {
      throw new Error('用戶數據不完整');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('用戶名或密碼錯誤');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    console.log('用戶登入成功:', username);
    return token;
  } catch (err) {
    console.error('loginUser Error:', err.message);
    throw err;
  }
}

async function getAllUsers() {
  try {
    const results = await query('SELECT id, username, email, role FROM users');
    console.log('查詢所有用戶結果:', { results });
    return results;
  } catch (err) {
    console.error('getAllUsers 錯誤:', { error: err.message, stack: err.stack });
    throw err;
  }
}

// 全部 export！
module.exports = {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  getUserByRecoveryCode,
  updatePassword
};