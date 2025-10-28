// services/noteService.js
const { query } = require('../db');

const NoteService = {
  async getNotes(userId, search = '', tagId = null, sort = 'updated') {
    let sql = `
      SELECT n.*, GROUP_CONCAT(nt.name) as tags, GROUP_CONCAT(nt.color) as tag_colors
      FROM notes n
      LEFT JOIN note_tag_relations ntr ON n.id = ntr.note_id
      LEFT JOIN note_tags nt ON ntr.tag_id = nt.id
      WHERE n.user_id = ?
    `;
    const params = [userId];

    if (search) {
      sql += ` AND (n.title LIKE ? OR n.content LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (tagId) {
      sql += ` AND ntr.tag_id = ?`;
      params.push(tagId);
    }

    sql += ` GROUP BY n.id`;

    const sortMap = {
      updated: 'n.updated_at DESC',
      title: 'n.title ASC',
      created: 'n.created_at DESC'
    };
    sql += ` ORDER BY ${sortMap[sort] || sortMap.updated}, n.is_pinned DESC`;

    const rows = await query(sql, params);
    return rows.map(row => ({
      ...row,
      tags: row.tags ? row.tags.split(',') : [],
      tag_colors: row.tag_colors ? row.tag_colors.split(',') : []
    }));
  },

  async createNote(userId, title, content = '', tags = []) {
    const result = await query(
      'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
      [userId, title, content]
    );
    const noteId = result.insertId;
    await this.updateTags(noteId, tags);
    return noteId;
  },

  async updateNote(userId, noteId, title, content, tags = []) {
    await query(
      'UPDATE notes SET title = ?, content = ?, updated_at = NOW() WHERE id = ? AND user_id = ?',
      [title, content, noteId, userId]
    );
    await this.updateTags(noteId, tags);
  },

  async updateTags(noteId, tagNames) {
    await query('DELETE FROM note_tag_relations WHERE note_id = ?', [noteId]);
    for (const name of tagNames) {
      if (!name.trim()) continue;
      let tag = await query('SELECT id FROM note_tags WHERE name = ?', [name]);
      let tagId;
      if (tag.length === 0) {
        const res = await query('INSERT INTO note_tags (name) VALUES (?)', [name]);
        tagId = res.insertId;
      } else {
        tagId = tag[0].id;
      }
      await query('INSERT IGNORE INTO note_tag_relations (note_id, tag_id) VALUES (?, ?)', [noteId, tagId]);
    }
  },

  async deleteNote(userId, noteId) {
    await query('DELETE FROM notes WHERE id = ? AND user_id = ?', [noteId, userId]);
  },

  async togglePin(userId, noteId) {
    await query(
      'UPDATE notes SET is_pinned = NOT is_pinned WHERE id = ? AND user_id = ?',
      [noteId, userId]
    );
  },

  async getTags(userId) {
    const rows = await query(`
      SELECT DISTINCT nt.*
      FROM note_tags nt
      JOIN note_tag_relations ntr ON nt.id = ntr.tag_id
      JOIN notes n ON ntr.note_id = n.id
      WHERE n.user_id = ?
      ORDER BY nt.name
    `, [userId]);
    return rows;
  },

  async createShareLink(noteId, expiresHours = null) {
    const token = require('crypto').randomBytes(16).toString('hex');
    const expires = expiresHours ? new Date(Date.now() + expiresHours * 3600000) : null;
    await query(
      'INSERT INTO shared_notes (note_id, share_token, expires_at) VALUES (?, ?, ?)',
      [noteId, token, expires]
    );
    return token;
  },

  async getNoteByShareToken(token) {
    const rows = await query(`
      SELECT n.*, sn.expires_at, u.username as shared_by
      FROM shared_notes sn
      JOIN notes n ON sn.note_id = n.id
      JOIN users u ON n.user_id = u.id
      WHERE sn.share_token = ? AND (sn.expires_at IS NULL OR sn.expires_at > NOW())
    `, [token]);
    return rows[0] || null;
  }
};

module.exports = NoteService;