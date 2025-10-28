// services/noteService.js
const { query } = require('../db');

async function getNotes(userId) {
  const rows = await query(
    'SELECT id, title, content, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY updated_at DESC',
    [userId]
  );
  return rows || [];
}

async function createNote(userId, title, content = '') {
  const result = await query(
    'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
    [userId, title, content]
  );
  return result.insertId;
}

async function updateNote(userId, noteId, title, content) {
  await query(
    'UPDATE notes SET title = ?, content = ?, updated_at = NOW() WHERE id = ? AND user_id = ?',
    [title, content, noteId, userId]
  );
}

async function deleteNote(userId, noteId) {
  await query('DELETE FROM notes WHERE id = ? AND user_id = ?', [noteId, userId]);
}

module.exports = { getNotes, createNote, updateNote, deleteNote };