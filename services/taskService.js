const { query } = require('../db');
const moment = require('moment-timezone');

async function getTasks(userId) {
  try {
    const results = await query('SELECT * FROM tasks WHERE user_id = ?', [userId]);
    console.log('查詢任務結果:', { userId, results });
    return results.map(task => ({
      ...task,
      due_date: moment(task.due_date).tz('Asia/Hong_Kong').format('YYYY-MM-DDTHH:mm:ssZ')
    })) || [];
  } catch (err) {
    console.error('查詢任務錯誤:', { userId, error: err.message, stack: err.stack });
    throw err;
  }
}

async function addTask(userId, title, description, dueDate) {
  if (!title || !dueDate) {
    throw new Error('請提供標題和到期日期');
  }
  if (!moment(dueDate, moment.ISO_8601, true).isValid()) {
    throw new Error('無效的到期日期格式');
  }
  if (moment(dueDate).isBefore(moment())) {
    throw new Error('到期日期必須是未來時間');
  }
  const formattedDueDate = moment.tz(dueDate, 'Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss');
  try {
    const result = await query(
      'INSERT INTO tasks (user_id, title, description, due_date, notified) VALUES (?, ?, ?, ?, FALSE)',
      [userId, title, description || '', formattedDueDate]
    );
    console.log('任務儲存成功:', result.insertId);
    return result.insertId;
  } catch (err) {
    console.error('addTask 錯誤:', { userId, title, description, dueDate: formattedDueDate, error: err.message, stack: err.stack });
    throw err;
  }
}

async function editTask(userId, taskId, title, description, dueDate) {
  if (!title || !dueDate) {
    throw new Error('請提供標題和到期日期');
  }
  if (!moment(dueDate, moment.ISO_8601, true).isValid()) {
    throw new Error('無效的到期日期格式');
  }
  if (moment(dueDate).isBefore(moment())) {
    throw new Error('到期日期必須是未來時間');
  }
  const formattedDueDate = moment.tz(dueDate, 'Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss');
  try {
    await query(
      'UPDATE tasks SET title = ?, description = ?, due_date = ?, notified = FALSE WHERE id = ? AND user_id = ?',
      [title, description || '', formattedDueDate, taskId, userId]
    );
    console.log('任務更新成功:', taskId);
  } catch (err) {
    console.error('editTask 錯誤:', { userId, taskId, title, description, dueDate: formattedDueDate, error: err.message, stack: err.stack });
    throw err;
  }
}

async function deleteTask(userId, taskId) {
  const uid = Number(userId);
  const tid = Number(taskId);

  if (!uid || !tid) {
    throw new Error('無效的 userId 或 taskId');
  }

  console.log('[DB] 執行刪除任務:', { userId: uid, taskId: tid });

  try {
    const result = await query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [tid, uid]
    );

    console.log('[DB] 刪除影響行數:', result.affectedRows);

    if (result.affectedRows === 0) {
      throw new Error('任務不存在或無權刪除');
    }
  } catch (err) {
    console.error('deleteTask 錯誤:', { userId: uid, taskId: tid, error: err.message });
    throw err;
  }
}

async function checkUpcomingTasks() {
  const now = moment().tz('Asia/Hong_Kong');
  const thirtyDaysAgo = now.clone().subtract(30, 'days');
  const inFiveMinutes = now.clone().add(5, 'minutes');

  console.log(`[DB] 查詢 ${thirtyDaysAgo.format()} ~ ${inFiveMinutes.format()}`);

  try {
    const results = await query(
      'SELECT t.*, ps.subscription FROM tasks t JOIN push_subscriptions ps ON t.user_id = ps.user_id WHERE t.due_date BETWEEN ? AND ? AND t.notified = FALSE',
      [thirtyDaysAgo.format('YYYY-MM-DD HH:mm:ss'), inFiveMinutes.format('YYYY-MM-DD HH:mm:ss')]
    );

    console.log(`[DB] 查到 ${results.length} 筆任務`);

    const taskMap = new Map();
    results.forEach(row => {
      const taskId = row.id;
      if (!taskMap.has(taskId)) {
        taskMap.set(taskId, {
          ...row,
          subscriptions: []
        });
      }
      taskMap.get(taskId).subscriptions.push(JSON.parse(row.subscription));
    });

    const finalTasks = Array.from(taskMap.values());
    return finalTasks;
  } catch (err) {
    console.error('checkUpcomingTasks 錯誤:', err.message);
    return [];
  }
}

async function markTaskAsNotified(taskId) {
  try {
    await query('UPDATE tasks SET notified = TRUE WHERE id = ?', [taskId]);
    console.log('任務通知狀態更新成功:', taskId);
  } catch (err) {
    console.error('markTaskAsNotified 錯誤:', { taskId, error: err.message, stack: err.stack });
    throw err;
  }
}

module.exports = { getTasks, addTask, editTask, deleteTask, checkUpcomingTasks, markTaskAsNotified };