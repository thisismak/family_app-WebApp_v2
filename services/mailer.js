// services/mailer.js
require('dotenv').config();
const nodemailer = require('nodemailer');

// 使用 .env 設定，支援 Postfix 中繼
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || '127.0.0.1',
  port: parseInt(process.env.MAIL_PORT) || 25,
  secure: process.env.MAIL_SECURE === 'true', // false for port 25
  auth: process.env.MAIL_USER && process.env.MAIL_PASS ? {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  } : undefined,
  tls: {
    rejectUnauthorized: false
  }
});

async function sendResetEmail(email, resetLink) {
  const fromAddress = process.env.MAIL_FROM || 'no-reply@mysandshome.com';

  const mailOptions = {
    from: `"我們的家庭空間" <${fromAddress}>`,
    to: email,
    subject: '【我們的家庭空間】密碼重設',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #FF8A9B;">密碼重設請求</h2>
        <p>您好，</p>
        <p>我們收到您要求重設密碼的請求。請點擊下方按鈕設定新密碼：</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: #FF8A9B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            立即重設密碼
          </a>
        </p>
        <p style="font-size: 0.9em; color: #666;">
          <strong>有效時間：</strong>1 小時<br>
          <strong>連結：</strong><br><a href="${resetLink}">${resetLink}</a>
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 0.8em; color: #999;">
          若您並未提出此請求，請忽略此郵件。<br>
          <strong>我們的家庭空間</strong> &copy; 2025
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('重設密碼郵件發送成功:', info.messageId);
    return info;
  } catch (error) {
    console.error('發送重設密碼郵件失敗:', error.message);
    throw error;
  }
}

module.exports = { sendResetEmail };